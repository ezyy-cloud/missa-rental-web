import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
  phone: string | null;
  bio: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  preferred_contact: 'email' | 'phone' | 'both' | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  is_owner: boolean;
  stripe_customer_id: string | null;
  stripe_account_id: string | null;
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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
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

        if (profileError) {
          throw profileError;
        }

        set({ profile });
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        
        if (event === 'SIGNED_IN' && session?.user) {
          set({ user: session.user });

          // Fetch user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            set({ error: 'Failed to fetch profile' });
          } else {
            set({ profile });
          }
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, profile: null });
        }
      });

    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ error: 'Failed to initialize auth' });
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        set({ user, profile });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      set({ error: 'Failed to sign in' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password, fullName) => {
    try {
      set({ loading: true, error: null });
      
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email,
            full_name: fullName,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          
        if (profileError) throw profileError;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        set({ user, profile });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      set({ error: 'Failed to sign up' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null, profile: null });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ error: 'Failed to sign out' });
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const { user, profile } = get();
      if (!user || !profile) throw new Error('No user logged in');

      set({ loading: true, error: null });

      // Only include fields that exist in the database
      const updateData = {
        email: data.email,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        phone: data.phone,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city: data.city,
        state: data.state,
        country: data.country,
        postal_code: data.postal_code,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      set({ profile: updatedProfile });
    } catch (error) {
      console.error('Error updating profile:', error);
      set({ error: 'Failed to update profile' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
