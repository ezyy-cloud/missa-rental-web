import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Car, FavoriteCar, Booking, Review } from '../types';

interface ExtendedCar extends Car {
  owner_name?: string;
  owner_avatar?: string;
  public_reviews?: Review[];
}

interface ExtendedReview extends Review {
  reviewer_name?: string;
  reviewer_avatar?: string;
  reviewee_name?: string;
  reviewee_avatar?: string;
  car_name?: string;
  car_image?: string;
}

interface ExtendedBooking extends Booking {
  car_name?: string;
  car_image?: string;
  renter_name?: string;
  renter_avatar?: string;
}

interface CarState {
  cars: ExtendedCar[];
  userCars: ExtendedCar[];
  favoriteCars: FavoriteCar[];
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
  userReviews: ExtendedReview[];
  fetchCars: () => Promise<void>;
  fetchUserCars: () => Promise<void>;
  fetchCar: (id: string) => Promise<void>;
  createCar: (data: Partial<Car>) => Promise<void>;
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
          owner:owner_id (
            id,
            full_name,
            avatar_url
          ),
          reviews (*)
        `);

      if (error) throw error;

      const extendedCars: ExtendedCar[] = cars.map(car => ({
        ...car,
        owner_name: car.owner?.full_name || null,
        owner_avatar: car.owner?.avatar_url || null,
        public_reviews: car.reviews || []
      }));

      set({ cars: extendedCars, loading: false });
    } catch (error) {
      console.error('Error fetching cars:', error);
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
          owner:profiles (
            id,
            full_name,
            avatar_url
          ),
          reviews (*)
        `)
        .eq('owner_id', user.user.id);

      if (error) throw error;

      const extendedCars: ExtendedCar[] = cars.map(car => ({
        ...car,
        owner_name: car.owner?.full_name || null,
        owner_avatar: car.owner?.avatar_url || null,
        public_reviews: car.reviews || []
      }));

      set({ userCars: extendedCars, loading: false });
    } catch (error) {
      console.error('Error fetching user cars:', error);
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
          owner:profiles (
            id,
            full_name,
            avatar_url
          ),
          reviews (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const extendedCar: ExtendedCar = {
        ...car,
        owner_name: car.owner?.full_name || null,
        owner_avatar: car.owner?.avatar_url || null,
        public_reviews: car.reviews || []
      };

      set({ currentCar: extendedCar, loading: false });
    } catch (error) {
      console.error('Error fetching car:', error);
      set({ error: 'Failed to fetch car', loading: false });
    }
  },

  createCar: async (data: Partial<Car>) => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user logged in');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.user.id)
        .single();

      if (profileError) throw profileError;

      const { data: car, error } = await supabase
        .from('cars')
        .insert({ ...data, owner_id: user.user.id })
        .select()
        .single();

      if (error) throw error;

      const extendedCar: ExtendedCar = {
        ...car,
        owner_name: profile.full_name || null,
        owner_avatar: profile.avatar_url || null,
        public_reviews: []
      };

      const userCars = [...get().userCars, extendedCar];
      set({ userCars, loading: false });
    } catch (error) {
      console.error('Error creating car:', error);
      set({ error: 'Failed to create car', loading: false });
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

      const extendedCar: ExtendedCar = {
        ...car,
        owner_name: car.owner?.full_name || null,
        owner_avatar: car.owner?.avatar_url || null,
        public_reviews: car.reviews || []
      };

      const userCars = get().userCars.map(c =>
        c.id === id ? extendedCar : c
      );
      set({ userCars, loading: false });

      if (get().currentCar?.id === id) {
        set({ currentCar: extendedCar });
      }
    } catch (error) {
      console.error('Error updating car:', error);
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
      console.error('Error deleting car:', error);
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
      console.error('Error toggling favorite:', error);
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
        console.error('Supabase error:', error);
        throw error;
      }

      const extendedFavorites: FavoriteCar[] = favorites.map(favorite => ({
        ...favorite,
        car: {
          ...favorite.car,
          owner_name: favorite.car.owner?.full_name || null,
          owner_avatar: favorite.car.owner?.avatar_url || null,
          public_reviews: favorite.car.reviews || []
        }
      }));

      set({ favoriteCars: extendedFavorites, loading: false });
    } catch (error) {
      console.error('Error fetching favorites:', error);
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
        .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return bookings.length === 0;
    } catch {
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
        console.error('Supabase error:', error);
        throw error;
      }
      set({ userBookings: bookings });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
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
        console.error('Supabase error:', error);
        throw error;
      }
      set({ userReviews: reviews });
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  },
}));