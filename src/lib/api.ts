import { supabase } from './supabase';
import type { Car, Booking } from '../types';

export async function createBooking(
  carId: string,
  startDate: string,
  endDate: string,
  totalPrice: number
): Promise<Booking> {
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      car_id: carId,
      start_date: startDate,
      end_date: endDate,
      total_price: totalPrice,
      renter_id: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return booking;
}

export async function checkCarAvailability(
  carId: string,
  startDate: string,
  endDate: string
): Promise<boolean> {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('car_id', carId)
    .eq('status', 'confirmed')
    .or(`start_date,overlaps,[${startDate},${endDate}]`);

  if (error) throw error;
  return bookings.length === 0;
}

export async function getCarBookings(carId: string): Promise<Booking[]> {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('car_id', carId)
    .order('start_date', { ascending: true });

  if (error) throw error;
  return bookings;
}

export async function getUserBookings(): Promise<Booking[]> {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*, car:cars(*)')
    .eq('renter_id', (await supabase.auth.getUser()).data.user?.id)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return bookings;
}