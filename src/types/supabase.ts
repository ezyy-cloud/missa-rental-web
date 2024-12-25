export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      cars: {
        Row: Car;
        Insert: Omit<Car, 'created_at' | 'updated_at' | 'average_rating' | 'total_reviews'>;
        Update: Partial<Omit<Car, 'id' | 'owner_id'>>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Booking, 'id' | 'car_id' | 'renter_id'>>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Review, 'id' | 'booking_id' | 'reviewer_id' | 'reviewee_id' | 'car_id'>>;
      };
      user_favorites: {
        Row: FavoriteCar;
        Insert: Omit<FavoriteCar, 'created_at'>;
        Update: Partial<Omit<FavoriteCar, 'user_id' | 'car_id'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  address: string | null;
  preferred_contact: 'email' | 'phone' | 'both' | null;
  verification_status: 'pending' | 'verified' | 'rejected' | null;
  id_type: 'passport' | 'national_id' | 'drivers_license' | null;
  id_number: string | null;
  id_expiry_date: string | null;
  id_country: string | null;
  drivers_license_number: string | null;
  drivers_license_expiry: string | null;
  drivers_license_country: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
  is_owner: boolean;
  stripe_customer_id: string | null;
  stripe_account_id: string | null;
}

export interface Car {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  location: string;
  make: string;
  model: string;
  year: number;
  color: string;
  transmission: 'automatic' | 'manual';
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  mileage: number;
  features: string[];
  availability_start: string;
  availability_end: string;
  created_at: string;
  updated_at: string;
  average_rating: number;
  total_reviews: number;
  status: 'available' | 'unavailable' | 'maintenance';
}

export interface Booking {
  id: string;
  car_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  car?: Car;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  car_id: string;
  rating: number;
  comment: string;
  review_type: 'renter' | 'owner' | 'car';
  created_at: string;
  updated_at: string;
  car?: Car;
}

export interface FavoriteCar {
  user_id: string;
  car_id: string;
  created_at: string;
}
