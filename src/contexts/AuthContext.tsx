
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useEmailAutomation } from '@/hooks/useEmailAutomation';
import { useNewsletterSubscription } from '@/hooks/useNewsletterSubscription';
import { cleanupAuthState } from '@/utils/authCleanup';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, acceptNewsletter?: boolean) => Promise<void>;
  signUp: (email: string, password: string, acceptNewsletter?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const emailAutomation = useEmailAutomation();
  const newsletterSubscription = useNewsletterSubscription();

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
              emailAutomation.sendWelcomeSequence?.mutate?.({
                email: session.user.email!,
                name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                type: 'welcome'
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
  }, [emailAutomation.sendWelcomeSequence]);

  const signIn = async (email: string, password: string, acceptNewsletter?: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email,
        password
      });

      if (error) throw error;
      
      // Subscribe to newsletter if user opted in and it's provided
      if (acceptNewsletter) {
        newsletterSubscription.subscribeToNewsletter?.mutate?.({ email });
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, acceptNewsletter?: boolean) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            newsletter_subscription: acceptNewsletter || false
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Subscribe to newsletter if user opted in
        if (acceptNewsletter) {
          newsletterSubscription.subscribeToNewsletter?.mutate?.({ email });
        }
        
        // Send welcome email sequence
        emailAutomation.sendWelcomeSequence?.mutate?.({
          email,
          name: '',
          type: 'welcome'
        });
      }
      
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Try to sign out gracefully, but don't fail if session doesn't exist
      try {
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        if (error && !error.message.includes('Session not found')) {
          console.warn('Sign out error:', error);
        }
      } catch (error) {
        // Ignore session not found errors during logout
        console.log('Logout attempted with expired session, continuing...');
      }
      
      // Force clear user state and reload page for clean state
      setUser(null);
      
      // Use a small delay to ensure state is cleared before redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear state and redirect
      setUser(null);
      cleanupAuthState();
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
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
