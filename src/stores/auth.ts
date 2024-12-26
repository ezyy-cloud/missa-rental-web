import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  created_at: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  error: null,
  initialized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),

  initialize: async () => {
    try {
      set({ loading: true, error: null });

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        set({ user: session.user });

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        set({ profile });
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        set({ user: session?.user ?? null });

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({ profile: profile ?? null });
        } else {
          set({ profile: null });
        }
      });

    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ error: 'Failed to initialize auth' });
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await supabase.auth.signOut();
      set({ user: null, profile: null });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ error: 'Failed to sign out' });
    } finally {
      set({ loading: false });
    }
  },
}));
