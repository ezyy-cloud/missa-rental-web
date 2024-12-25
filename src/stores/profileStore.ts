import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile, Notification } from '../types';

interface ProfileState {
  profile: Profile | null;
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user found');

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.user.id)
        .single();

      if (error) throw error;
      set({ profile, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch profile', loading: false });
    }
  },

  updateProfile: async (data: Partial<Profile>) => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user found');

      // Try to create the profile first
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .upsert(
          { 
            id: user.user.id,
            email: user.user.email,
            ...data 
          },
          { 
            onConflict: 'id',
            ignoreDuplicates: false
          }
        )
        .select('*')
        .single();

      if (insertError) {
        console.error('Profile upsert error:', insertError);
        throw insertError;
      }

      set({ profile: newProfile, loading: false });
    } catch (error) {
      console.error('Failed to update profile:', error);
      set({ error: 'Failed to update profile', loading: false });
    }
  },

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user found');

      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const unreadCount = notifications?.filter(n => !n.read).length || 0;
      set({ notifications: notifications || [], unreadCount, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch notifications', loading: false });
    }
  },

  markNotificationAsRead: async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      const notifications = get().notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter(n => !n.read).length;
      set({ notifications, unreadCount });
    } catch (error) {
      set({ error: 'Failed to mark notification as read' });
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user found');

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.user.id);

      if (error) throw error;

      const notifications = get().notifications.map(n => ({ ...n, read: true }));
      set({ notifications, unreadCount: 0 });
    } catch (error) {
      set({ error: 'Failed to mark all notifications as read' });
    }
  },
}));
