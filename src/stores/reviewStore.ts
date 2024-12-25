import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Review } from '../types';

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchReviews: (type: 'car' | 'user', id: string) => Promise<void>;
  createReview: (data: Partial<Review>) => Promise<void>;
  updateReview: (id: string, data: Partial<Review>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  loading: false,
  error: null,

  fetchReviews: async (type: 'car' | 'user', id: string) => {
    set({ loading: true, error: null });
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(*),
          reviewee:profiles!reviews_reviewee_id_fkey(*),
          car:cars(*)
        `)
        .order('created_at', { ascending: false });

      if (type === 'car') {
        query = query.eq('car_id', id);
      } else {
        query = query.eq('reviewee_id', id);
      }

      const { data, error } = await query;

      if (error) throw error;
      set({ reviews: data || [], loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch reviews', loading: false });
    }
  },

  createReview: async (data: Partial<Review>) => {
    set({ loading: true, error: null });
    try {
      const { data: review, error } = await supabase
        .from('reviews')
        .insert(data)
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(*),
          reviewee:profiles!reviews_reviewee_id_fkey(*),
          car:cars(*)
        `)
        .single();

      if (error) throw error;

      // Update average rating for car if it's a car review
      if (data.car_id && data.review_type === 'car') {
        const { data: ratings } = await supabase
          .from('reviews')
          .select('rating')
          .eq('car_id', data.car_id)
          .eq('review_type', 'car');

        if (ratings) {
          const average = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
          await supabase
            .from('cars')
            .update({ average_rating: average })
            .eq('id', data.car_id);
        }
      }

      const reviews = [...get().reviews, review];
      set({ reviews, loading: false });
    } catch (error) {
      set({ error: 'Failed to create review', loading: false });
    }
  },

  updateReview: async (id: string, data: Partial<Review>) => {
    set({ loading: true, error: null });
    try {
      const { data: review, error } = await supabase
        .from('reviews')
        .update(data)
        .eq('id', id)
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(*),
          reviewee:profiles!reviews_reviewee_id_fkey(*),
          car:cars(*)
        `)
        .single();

      if (error) throw error;

      const reviews = get().reviews.map(r =>
        r.id === id ? review : r
      );
      set({ reviews, loading: false });
    } catch (error) {
      set({ error: 'Failed to update review', loading: false });
    }
  },

  deleteReview: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const reviews = get().reviews.filter(r => r.id !== id);
      set({ reviews, loading: false });
    } catch (error) {
      set({ error: 'Failed to delete review', loading: false });
    }
  },
}));
