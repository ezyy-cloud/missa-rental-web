import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Profile, Car, AdminStats, AdminAction, Booking } from '@/types';

interface AdminStore {
  stats: AdminStats | null;
  pendingUsers: Profile[];
  pendingCars: Car[];
  pendingBookings: Booking[];
  recentActions: AdminAction[];
  settings: {
    commission_rate: number;
    minimum_rental_duration: number;
    maximum_rental_duration: number;
    platform_name: string;
    support_email: string;
    terms_of_service: string;
    privacy_policy: string;
    maintenance_mode: boolean;
    require_id_verification: boolean;
    require_car_insurance: boolean;
    auto_approve_verified_owners: boolean;
  } | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchPendingUsers: () => Promise<void>;
  fetchPendingCars: () => Promise<void>;
  fetchPendingBookings: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: AdminStore['settings']) => Promise<void>;
  verifyUser: (userId: string) => Promise<void>;
  suspendUser: (userId: string, reason: string) => Promise<void>;
  approveCar: (carId: string) => Promise<void>;
  rejectCar: (carId: string, reason: string) => Promise<void>;
  flagCar: (carId: string, reason: string) => Promise<void>;
  approveBooking: (bookingId: string) => Promise<void>;
  rejectBooking: (bookingId: string, reason: string) => Promise<void>;
  flagBooking: (bookingId: string, reason: string) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  stats: null,
  pendingUsers: [],
  pendingCars: [],
  pendingBookings: [],
  recentActions: [],
  settings: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    try {
      set({ loading: true, error: null });
      
      // Fetch users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch cars count
      const { count: totalCars } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true });

      // Fetch bookings count
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // TODO: Add more stats calculations

      set({
        stats: {
          total_users: totalUsers || 0,
          total_cars: totalCars || 0,
          total_bookings: totalBookings || 0,
          total_revenue: 0, // TODO: Calculate from bookings
          new_users_last_month: 0,
          new_cars_last_month: 0,
          new_bookings_last_month: 0,
          revenue_last_month: 0,
        },
        loading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch stats', loading: false });
    }
  },

  fetchPendingUsers: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('verification_status', 'pending');

      if (error) throw error;

      set({ pendingUsers: data || [], loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch pending users', loading: false });
    }
  },

  fetchPendingCars: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('cars')
        .select('*, owner:profiles(*)')
        .eq('approval_status', 'pending');

      if (error) throw error;

      set({ pendingCars: data || [], loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch pending cars', loading: false });
    }
  },

  fetchPendingBookings: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*, car:cars(*), renter:profiles(*)')
        .eq('status', 'pending');

      if (error) throw error;

      set({ pendingBookings: data || [], loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch pending bookings', loading: false });
    }
  },

  fetchRecentActions: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('admin_actions')
        .select('*, admin:profiles(*)')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      set({ recentActions: data || [], loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch recent actions', loading: false });
    }
  },

  fetchSettings: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .single();

      if (error) throw error;

      set({ settings: data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch settings', loading: false });
    }
  },

  updateSettings: async (settings) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('platform_settings')
        .upsert(settings);

      if (error) throw error;

      set({ settings, loading: false });
    } catch (error) {
      set({ error: 'Failed to update settings', loading: false });
    }
  },

  verifyUser: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('profiles')
        .update({ verification_status: 'verified' })
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'verify_user',
        target_id: userId,
      });

      await get().fetchPendingUsers();
      await get().fetchRecentActions();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to verify user', loading: false });
    }
  },

  suspendUser: async (userId: string, reason: string) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_suspended: true })
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'suspend_user',
        target_id: userId,
        reason,
      });

      await get().fetchPendingUsers();
      await get().fetchRecentActions();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to suspend user', loading: false });
    }
  },

  approveCar: async (carId: string) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('cars')
        .update({ approval_status: 'approved', status: 'available' })
        .eq('id', carId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'approve_car',
        target_id: carId,
      });

      await get().fetchPendingCars();
      await get().fetchRecentActions();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to approve car', loading: false });
    }
  },

  rejectCar: async (carId: string, reason: string) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('cars')
        .update({
          approval_status: 'rejected',
          status: 'rejected',
          rejection_reason: reason,
        })
        .eq('id', carId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'reject_car',
        target_id: carId,
        reason,
      });

      await get().fetchPendingCars();
      await get().fetchRecentActions();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to reject car', loading: false });
    }
  },

  flagCar: async (carId: string, reason: string) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('cars')
        .update({ status: 'maintenance' })
        .eq('id', carId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'flag_car',
        target_id: carId,
        reason,
      });

      await get().fetchPendingCars();
      await get().fetchRecentActions();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to flag car', loading: false });
    }
  },

  approveBooking: async (bookingId: string) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'approve_booking',
        target_id: bookingId,
      });

      await get().fetchPendingBookings();
      await get().fetchRecentActions();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to approve booking', loading: false });
    }
  },

  rejectBooking: async (bookingId: string, reason: string) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'reject_booking',
        target_id: bookingId,
        reason,
      });

      await get().fetchPendingBookings();
      await get().fetchRecentActions();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to reject booking', loading: false });
    }
  },

  flagBooking: async (bookingId: string, reason: string) => {
    try {
      set({ loading: true, error: null });
      
      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'flag_booking',
        target_id: bookingId,
        reason,
      });

      await get().fetchPendingBookings();
      await get().fetchRecentActions();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to flag booking', loading: false });
    }
  },
}));
