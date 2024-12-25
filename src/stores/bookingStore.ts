import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Booking, Message } from '../types';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  fetchBooking: (id: string) => Promise<void>;
  createBooking: (data: Partial<Booking>) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  fetchMessages: (bookingId: string) => Promise<void>;
  sendMessage: (bookingId: string, content: string, receiverId: string) => Promise<void>;
  markMessagesAsRead: (bookingId: string) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  currentBooking: null,
  messages: [],
  loading: false,
  error: null,

  fetchBookings: async () => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user found');

      // First get bookings where user is the renter
      const { data: renterBookings, error: renterError } = await supabase
        .from('bookings')
        .select(`
          *,
          car:cars(*),
          renter:profiles!bookings_renter_id_fkey(*),
          reviews(*)
        `)
        .eq('renter_id', user.user.id)
        .order('created_at', { ascending: false });

      if (renterError) throw renterError;

      // Then get bookings where user is the car owner
      const { data: ownerBookings, error: ownerError } = await supabase
        .from('bookings')
        .select(`
          *,
          car:cars(*),
          renter:profiles!bookings_renter_id_fkey(*),
          reviews(*)
        `)
        .eq('car.owner_id', user.user.id)
        .order('created_at', { ascending: false });

      if (ownerError) throw ownerError;

      // Combine and deduplicate bookings
      const allBookings = [...(renterBookings || []), ...(ownerBookings || [])];
      const uniqueBookings = Array.from(new Map(allBookings.map(booking => [booking.id, booking])).values());
      
      set({ bookings: uniqueBookings, loading: false });
    } catch (error) {
      console.error('Fetch bookings error:', error);
      set({ error: 'Failed to fetch bookings', loading: false });
    }
  },

  fetchBooking: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          car:cars(*),
          renter:profiles!bookings_renter_id_fkey(*),
          reviews(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ currentBooking: data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch booking', loading: false });
    }
  },

  createBooking: async (data: Partial<Booking>) => {
    set({ loading: true, error: null });
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      const bookings = [...get().bookings, booking];
      set({ bookings, loading: false });
    } catch (error) {
      set({ error: 'Failed to create booking', loading: false });
    }
  },

  updateBookingStatus: async (id: string, status: Booking['status']) => {
    set({ loading: true, error: null });
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const bookings = get().bookings.map(b =>
        b.id === id ? { ...b, status } : b
      );
      set({ bookings, loading: false });

      if (get().currentBooking?.id === id) {
        set({ currentBooking: { ...get().currentBooking, status } });
      }
    } catch (error) {
      set({ error: 'Failed to update booking status', loading: false });
    }
  },

  fetchMessages: async (bookingId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `)
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ messages: data || [], loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch messages', loading: false });
    }
  },

  sendMessage: async (bookingId: string, content: string, receiverId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user found');

      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          booking_id: bookingId,
          sender_id: user.user.id,
          receiver_id: receiverId,
          content
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `)
        .single();

      if (error) throw error;

      const messages = [...get().messages, message];
      set({ messages });
    } catch (error) {
      set({ error: 'Failed to send message' });
    }
  },

  markMessagesAsRead: async (bookingId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user found');

      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('booking_id', bookingId)
        .eq('receiver_id', user.user.id);

      if (error) throw error;

      const messages = get().messages.map(m =>
        m.receiver_id === user.user.id ? { ...m, read: true } : m
      );
      set({ messages });
    } catch (error) {
      set({ error: 'Failed to mark messages as read' });
    }
  },
}));
