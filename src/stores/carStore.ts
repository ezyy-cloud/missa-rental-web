import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Car, Booking } from '../types';
import type { CarType } from '../types/car';

interface ExtendedCar extends Omit<Car, 'type'> {
  type: CarType;
  owner_name?: string | null;
  owner_avatar?: string | null;
}

interface ExtendedBooking extends Booking {
  car_name?: string | null;
  car_image?: string | null;
  renter_name?: string | null;
  renter_avatar?: string | null;
}

interface CarState {
  cars: ExtendedCar[];
  userCars: ExtendedCar[];
  favoriteCars: any[];
  currentCar: ExtendedCar | null;
  loading: boolean;
  error: string | null;
  searchParams: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    make?: string;
    startDate?: string;
    endDate?: string;
    transmission?: 'automatic' | 'manual';
    minSeats?: number;
  };
  userBookings: ExtendedBooking[];
  userReviews: any[];
  fetchCars: () => Promise<void>;
  fetchUserCars: () => Promise<void>;
  fetchCar: (id: string) => Promise<void>;
  createCar: (data: Partial<Car>) => Promise<Car>;
  updateCar: (id: string, data: Partial<Car>) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  setSearchParams: (params: CarState['searchParams']) => void;
  toggleFavorite: (carId: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  checkAvailability: (carId: string, startDate: string, endDate: string) => Promise<boolean>;
  fetchUserBookings: () => Promise<void>;
  fetchUserReviews: () => Promise<void>;
}

export const useCarStore = create<CarState>((set, get) => ({
  cars: [],
  userCars: [],
  favoriteCars: [],
  currentCar: null,
  loading: false,
  error: null,
  searchParams: {},
  userBookings: [],
  userReviews: [],

  fetchCars: async () => {
    set({ loading: true, error: null });
    try {
      const { data: cars, error } = await supabase
        .from('cars')
        .select(`
          *,
          owner:profiles!cars_owner_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          reviews (
            rating
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const extendedCars: ExtendedCar[] = (cars || []).map(car => {
        const owner = Array.isArray(car.owner) ? car.owner[0] : car.owner;
        return {
          ...car,
          owner_name: owner?.full_name || null,
          owner_avatar: owner?.avatar_url || null,
          rating: car.reviews?.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / (car.reviews?.length || 1) || null,
          make: car.make || '',
          model: car.model || '',
          year: car.year || new Date().getFullYear(),
          approval_status: car.approval_status || 'pending',
          updated_at: car.updated_at || car.created_at
        };
      });
      set({ cars: extendedCars, loading: false, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch cars', loading: false });
    }
  },

  fetchUserCars: async () => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user logged in');

      const { data: cars, error } = await supabase
        .from('cars')
        .select(`
          *,
          owner:profiles!cars_owner_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          reviews (*)
        `)
        .eq('owner_id', user.user.id);

      if (error) throw error;

      const extendedCars: ExtendedCar[] = cars.map(car => {
        const owner = Array.isArray(car.owner) ? car.owner[0] : car.owner;
        return {
          ...car,
          owner_name: owner?.full_name || null,
          owner_avatar: owner?.avatar_url || null,
        };
      });

      set({ userCars: extendedCars, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch your cars', loading: false });
    }
  },

  fetchCar: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data: car, error } = await supabase
        .from('cars')
        .select(`
          *,
          owner:profiles!cars_owner_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          reviews (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const owner = Array.isArray(car.owner) ? car.owner[0] : car.owner;
      const extendedCar: ExtendedCar = {
        ...car,
        owner_name: owner?.full_name || null,
        owner_avatar: owner?.avatar_url || null,
      };

      set({ currentCar: extendedCar, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch car details', loading: false });
    }
  },

  createCar: async (carData: Partial<Car>) => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: car, error } = await supabase
        .from('cars')
        .insert({
          ...carData,
          owner_id: user.id,
        })
        .select(`
          *,
          owner:profiles!cars_owner_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      const owner = Array.isArray(car.owner) ? car.owner[0] : car.owner;
      const extendedCar: ExtendedCar = {
        ...car,
        owner_name: owner?.full_name || null,
        owner_avatar: owner?.avatar_url || null,
      };

      set((state) => ({
        cars: [...state.cars, extendedCar],
        userCars: [...state.userCars, extendedCar],
        loading: false
      }));

      return car;
    } catch (error) {
      set({ error: 'Failed to create car listing', loading: false });
      throw error;
    }
  },

  updateCar: async (id: string, data: Partial<Car>) => {
    set({ loading: true, error: null });
    try {
      const { data: car, error } = await supabase
        .from('cars')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const owner = Array.isArray(car.owner) ? car.owner[0] : car.owner;
      const extendedCar: ExtendedCar = {
        ...car,
        owner_name: owner?.full_name || null,
        owner_avatar: owner?.avatar_url || null,
      };

      const userCars = get().userCars.map(c =>
        c.id === id ? extendedCar : c
      );
      set({ userCars, loading: false });

      if (get().currentCar?.id === id) {
        set({ currentCar: extendedCar });
      }
    } catch (error) {
      set({ error: 'Failed to update car', loading: false });
    }
  },

  deleteCar: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const userCars = get().userCars.filter(c => c.id !== id);
      set({ userCars, loading: false });
    } catch (error) {
      set({ error: 'Failed to delete car', loading: false });
    }
  },

  setSearchParams: (params) => {
    set({ searchParams: params });
    get().fetchCars();
  },

  toggleFavorite: async (carId: string) => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user logged in');

      const { data: existingFavorite, error: favoriteError } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('car_id', carId)
        .single();

      if (favoriteError && favoriteError.code !== 'PGRST116') {
        throw favoriteError;
      }

      if (existingFavorite) {
        const { error: deleteError } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.user.id)
          .eq('car_id', carId);

        if (deleteError) throw deleteError;

        const favoriteCars = get().favoriteCars.filter(fav => fav.car_id !== carId);
        set({ favoriteCars });
      } else {
        const { data: car, error: carError } = await supabase
          .from('cars')
          .select('*')
          .eq('id', carId)
          .single();

        if (carError) throw carError;

        const { data: favorite, error: insertError } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.user.id,
            car_id: carId,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        const favoriteCars = [...get().favoriteCars, { ...favorite, car }];
        set({ favoriteCars });
      }
    } catch (error) {
      set({ error: 'Failed to toggle favorite' });
    }
  },

  fetchFavorites: async () => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user logged in');

      const { data: favorites, error } = await supabase
        .from('user_favorites')
        .select('*, car:cars (*)')
        .eq('user_id', user.user.id);

      if (error) {
        throw error;
      }

      const extendedFavorites = favorites.map(favorite => ({
        ...favorite,
        car: {
          ...favorite.car,
          owner_name: favorite.car.owner?.full_name || null,
          owner_avatar: favorite.car.owner?.avatar_url || null,
        }
      }));

      set({ favoriteCars: extendedFavorites, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch favorites', loading: false });
    }
  },

  checkAvailability: async (carId: string, startDate: string, endDate: string) => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('car_id', carId)
        .eq('status', 'confirmed')
        .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

      if (error) {
        throw error;
      }
      
      // Car is available if there are no overlapping bookings
      return bookings.length === 0;
    } catch (error) {
      return false;
    }
  },

  fetchUserBookings: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user logged in');

      const { data: bookings, error } = await supabase
        .from('user_bookings')
        .select('*')
        .or(`renter_id.eq.${user.user.id},car.owner_id.eq.${user.user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      set({ userBookings: bookings });
    } catch (error) {
      throw error;
    }
  },

  fetchUserReviews: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user logged in');

      const { data: reviews, error } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('reviewee_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      set({ userReviews: reviews });
    } catch (error) {
      throw error;
    }
  },
}));