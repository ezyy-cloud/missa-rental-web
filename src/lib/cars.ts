import { supabase } from './supabase';
import type { Car } from '@/types/car';

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
    .select(`
      *,
      owner_profile:profiles!cars_owner_id_fkey(*),
      bookings(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserCars() {
  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      owner_profile:profiles!cars_owner_id_fkey(*)
    `)
    .eq('owner_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;
  return data;
}

export async function searchCars(params: {
  location?: string;
  startDate?: string;
  endDate?: string;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  let query = supabase
    .from('cars')
    .select(`
      *,
      owner_profile:profiles!cars_owner_id_fkey(*)
    `)
    .eq('approval_status', 'approved');

  if (params.location) {
    query = query.ilike('location', `%${params.location}%`);
  }

  if (params.make) {
    query = query.ilike('make', `%${params.make}%`);
  }

  if (params.model) {
    query = query.ilike('model', `%${params.model}%`);
  }

  if (params.minPrice !== undefined) {
    query = query.gte('price', params.minPrice);
  }

  if (params.maxPrice !== undefined) {
    query = query.lte('price', params.maxPrice);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Filter by date availability if dates are provided
  if (params.startDate && params.endDate) {
    const availableCars = await Promise.all(
      data.map(async (car) => {
        const isAvailable = await checkCarAvailability(car.id, params.startDate!, params.endDate!);
        return isAvailable ? car : null;
      })
    );
    return availableCars.filter((car): car is Car => car !== null);
  }

  return data;
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
    .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

  if (error) throw error;
  return bookings.length === 0;
}