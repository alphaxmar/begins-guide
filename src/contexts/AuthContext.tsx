
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cleanupAuthState } from '@/utils/authCleanup';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      // Update state synchronously
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        // Defer data fetching to prevent deadlocks
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['profile', session?.user?.id] });
        }, 0);
      }
      
      if (event === 'SIGNED_OUT') {
        // Clean up all queries when signing out
        queryClient.clear();
      }
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          // Clean up on error
          cleanupAuthState();
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        cleanupAuthState();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, [queryClient]);

  const signOut = async () => {
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Clear React Query cache
      queryClient.clear();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Sign out error (continuing):', err);
      }
      
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error during sign out:', error);
      // Force redirect even on error
      window.location.href = '/auth';
    }
  };

  const value = {
    session,
    user,
    profile,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
