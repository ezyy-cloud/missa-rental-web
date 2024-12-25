import { supabase } from './supabase';
import type { Car } from '../types';

export async function createCar(carData: Omit<Car, 'id' | 'owner_id'>) {
  const { data, error } = await supabase
    .from('cars')
    .insert({
      ...carData,
      owner_id: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCar(id: string, carData: Partial<Car>) {
  const { data, error } = await supabase
    .from('cars')
    .update(carData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCar(id: string) {
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getCar(id: string) {
  const { data, error } = await supabase
    .from('cars')
    .select('*, bookings(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserCars() {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('owner_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;
  return data;
}

export async function searchCars(params: {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  make?: string;
  startDate?: string;
  endDate?: string;
}) {
  let query = supabase.from('cars').select('*');

  if (params.location) {
    query = query.ilike('location', `%${params.location}%`);
  }

  if (params.minPrice) {
    query = query.gte('price', params.minPrice);
  }

  if (params.maxPrice) {
    query = query.lte('price', params.maxPrice);
  }

  if (params.make) {
    query = query.ilike('make', `%${params.make}%`);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Filter out cars that are booked for the requested dates
  if (params.startDate && params.endDate) {
    const availableCars = await Promise.all(
      data.map(async (car) => {
        const isAvailable = await checkCarAvailability(
          car.id,
          params.startDate!,
          params.endDate!
        );
        return isAvailable ? car : null;
      })
    );

    return availableCars.filter(Boolean);
  }

  return data;
}

async function checkCarAvailability(
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