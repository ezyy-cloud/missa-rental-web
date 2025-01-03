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
  currentAdmin: Profile | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchPendingUsers: () => Promise<void>;
  fetchPendingCars: () => Promise<void>;
  fetchPendingBookings: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: AdminStore['settings']) => Promise<void>;
  verifyUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string, reason: string) => Promise<void>;
  suspendUser: (userId: string, reason: string) => Promise<void>;
  unsuspendUser: (userId: string) => Promise<void>;
  approveCar: (carId: string) => Promise<void>;
  rejectCar: (carId: string, reason: string) => Promise<void>;
  flagCar: (carId: string, reason: string) => Promise<void>;
  approveBooking: (bookingId: string) => Promise<void>;
  rejectBooking: (bookingId: string, reason: string) => Promise<void>;
  flagBooking: (bookingId: string, reason: string) => Promise<void>;
  initializeAdmin: () => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  stats: null,
  pendingUsers: [],
  pendingCars: [],
  pendingBookings: [],
  recentActions: [],
  settings: null,
  currentAdmin: null,
  loading: false,
  error: null,

  initializeAdmin: async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        if (profile && profile.role === 'admin') {
          set({ currentAdmin: profile });
        }
      }
    } catch (error) {
      console.error('Error initializing admin:', error);
      set({ error: 'Failed to initialize admin' });
    }
  },

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
      console.error('Error fetching stats:', error);
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
      console.error('Error fetching pending users:', error);
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
      console.error('Error fetching pending cars:', error);
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
      console.error('Error fetching pending bookings:', error);
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
      console.error('Error fetching settings:', error);
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
      console.error('Error updating settings:', error);
    }
  },

  verifyUser: async (userId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          kyc_status: 'verified',
          kyc_verified_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  },

  rejectUser: async (userId: string, reason: string) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          verification_status: 'rejected',
          is_suspended: false,
          suspension_reason: reason,
          suspended_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Log the admin action
      const { error: logError } = await supabase.from('admin_actions').insert({
        admin_id: get().currentAdmin?.id,
        user_id: userId,
        action: 'reject_user',
        reason,
        timestamp: new Date().toISOString(),
      });

      if (logError) throw logError;
    } catch (error) {
      console.error('Error rejecting user:', error);
      throw error;
    }
  },

  suspendUser: async (userId: string, reason: string) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_suspended: true,
          suspension_reason: reason,
          suspended_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Log the admin action
      const { error: logError } = await supabase.from('admin_actions').insert({
        admin_id: get().currentAdmin?.id,
        user_id: userId,
        action: 'suspend_user',
        reason,
        timestamp: new Date().toISOString(),
      });

      if (logError) throw logError;
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  },

  unsuspendUser: async (userId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_suspended: false,
          suspension_reason: null,
          suspended_at: null,
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Log the admin action
      const { error: logError } = await supabase.from('admin_actions').insert({
        admin_id: get().currentAdmin?.id,
        user_id: userId,
        action: 'unsuspend_user',
        timestamp: new Date().toISOString(),
      });

      if (logError) throw logError;
    } catch (error) {
      console.error('Error unsuspending user:', error);
      throw error;
    }
  },

  approveCar: async (carId: string) => {
    try {
      set({ loading: true, error: null });

      const { error: approvalError } = await supabase
        .from('cars')
        .update({ 
          approval_status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', carId);

      if (approvalError) throw approvalError;

      // Log admin action
      const { error: actionError } = await supabase
        .from('admin_actions')
        .insert({
          action_type: 'approve_car',
          target_id: carId,
          target_type: 'car',
          admin_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (actionError) throw actionError;

      // Refresh pending cars
      await get().fetchPendingCars();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to approve car', loading: false });
      console.error('Error approving car:', error);
    }
  },

  rejectCar: async (carId: string, reason: string) => {
    try {
      set({ loading: true, error: null });

      const { error: rejectionError } = await supabase
        .from('cars')
        .update({ 
          approval_status: 'rejected',
          rejection_reason: reason,
          rejected_at: new Date().toISOString()
        })
        .eq('id', carId);

      if (rejectionError) throw rejectionError;

      // Log admin action
      const { error: actionError } = await supabase
        .from('admin_actions')
        .insert({
          action_type: 'reject_car',
          target_id: carId,
          target_type: 'car',
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          reason
        });

      if (actionError) throw actionError;

      // Refresh pending cars
      await get().fetchPendingCars();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to reject car', loading: false });
      console.error('Error rejecting car:', error);
    }
  },

  flagCar: async (carId: string, reason: string) => {
    try {
      set({ loading: true, error: null });

      const { error: flagError } = await supabase
        .from('cars')
        .update({ 
          is_flagged: true,
          flag_reason: reason,
          flagged_at: new Date().toISOString()
        })
        .eq('id', carId);

      if (flagError) throw flagError;

      // Log admin action
      const { error: actionError } = await supabase
        .from('admin_actions')
        .insert({
          action_type: 'flag_car',
          target_id: carId,
          target_type: 'car',
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          reason
        });

      if (actionError) throw actionError;

      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to flag car', loading: false });
      console.error('Error flagging car:', error);
    }
  },

  approveBooking: async (bookingId: string) => {
    try {
      set({ loading: true, error: null });

      const { error: approvalError } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (approvalError) throw approvalError;

      // Log admin action
      const { error: actionError } = await supabase
        .from('admin_actions')
        .insert({
          action_type: 'approve_booking',
          target_id: bookingId,
          target_type: 'booking',
          admin_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (actionError) throw actionError;

      // Refresh pending bookings
      await get().fetchPendingBookings();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to approve booking', loading: false });
      console.error('Error approving booking:', error);
    }
  },

  rejectBooking: async (bookingId: string, reason: string) => {
    try {
      set({ loading: true, error: null });

      const { error: rejectionError } = await supabase
        .from('bookings')
        .update({ 
          status: 'rejected',
          rejection_reason: reason,
          rejected_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (rejectionError) throw rejectionError;

      // Log admin action
      const { error: actionError } = await supabase
        .from('admin_actions')
        .insert({
          action_type: 'reject_booking',
          target_id: bookingId,
          target_type: 'booking',
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          reason
        });

      if (actionError) throw actionError;

      // Refresh pending bookings
      await get().fetchPendingBookings();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to reject booking', loading: false });
      console.error('Error rejecting booking:', error);
    }
  },

  flagBooking: async (bookingId: string, reason: string) => {
    try {
      set({ loading: true, error: null });

      const { error: flagError } = await supabase
        .from('bookings')
        .update({ 
          is_flagged: true,
          flag_reason: reason,
          flagged_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (flagError) throw flagError;

      // Log admin action
      const { error: actionError } = await supabase
        .from('admin_actions')
        .insert({
          action_type: 'flag_booking',
          target_id: bookingId,
          target_type: 'booking',
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          reason
        });

      if (actionError) throw actionError;

      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to flag booking', loading: false });
      console.error('Error flagging booking:', error);
    }
  },
}));
