import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useWelcomeEmail } from '@/hooks/useEmailSubscription';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const sendWelcomeEmail = useWelcomeEmail();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false);
    }

    getSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, []);

  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {}
      }
    });

    if (error) throw error;

    // Send welcome email for new users
    if (data.user && !data.user.email_confirmed_at) {
      try {
        await sendWelcomeEmail.mutateAsync(email);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't throw here as signup was successful
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) throw error;
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
