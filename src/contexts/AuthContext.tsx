
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useWelcomeEmail } from '@/hooks/useWelcomeEmail';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { mutate: sendWelcomeEmail } = useWelcomeEmail();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Check if this is a new user by looking at created_at vs current time
          // If user was created very recently (within last 5 minutes), send welcome email
          if (session?.user) {
            const userCreatedAt = new Date(session.user.created_at);
            const now = new Date();
            const timeDiff = now.getTime() - userCreatedAt.getTime();
            const minutesDiff = timeDiff / (1000 * 60);
            
            if (minutesDiff < 5) {
              sendWelcomeEmail({
                userEmail: session.user.email!,
                userName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || undefined
              });
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    // Check if there's an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [sendWelcomeEmail]);

  const signIn = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const { error } = password
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signInWithOtp({ 
            email, 
            options: { 
              shouldCreateUser: false,
              emailRedirectTo: `${window.location.origin}/`
            } 
          });

      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password: password || '',
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
