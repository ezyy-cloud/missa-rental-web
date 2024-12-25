import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useProfileStore } from './profileStore';

interface AuthState {
  user: any;
  session: any;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  setUser: (user: any) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  initialized: false,

  setUser: (user) => set({ user }),

  initialize: async () => {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        set({ user, session, initialized: true, loading: false });
      } else {
        set({ user: null, session: null, initialized: true, loading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;
          set({ user, session, loading: false });
          await useProfileStore.getState().fetchProfile();
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, session: null, loading: false });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ error: 'Failed to initialize auth', loading: false, initialized: true });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({ user: data.user, session: data.session, loading: false });
    } catch (error: any) {
      console.error('Sign in error:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signUp: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) throw error;

      set({ user: authData.user, session: authData.session, loading: false });
    } catch (error: any) {
      console.error('Sign up error:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, loading: false });
    } catch (error: any) {
      console.error('Sign out error:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));