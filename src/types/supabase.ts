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
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  kyc_status: 'pending' | 'verified' | 'rejected';
  verified_at: string | null;
  kyc_verified_at: string | null;
  is_owner: boolean;
  stripe_customer_id: string | null;
  stripe_account_id: string | null;
  created_at: string;
  updated_at: string;
  // ID Document URLs
  id_front_url: string | null;
  id_back_url: string | null;
  // Driver's License URLs
  drivers_license_front_url: string | null;
  drivers_license_back_url: string | null;
  drivers_license_country: string | null;
  // Selfie
  selfie_url: string | null;
  // Additional Information
  additional_info: string | null;
  // Suspension
  is_suspended: boolean;
  suspended_at: string | null;
  suspension_reason: string | null;
}

export interface Car {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  image: string[] | null;
  price: number;
  location: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  transmission: 'automatic' | 'manual' | null;
  seats: number | null;
  type: 'Sedan' | 'SUV' | 'Sports Car' | 'Luxury' | 'Electric' | 'Convertible' | 'Van' | 'Truck';
  status: 'available' | 'maintenance' | 'rented' | 'unavailable';
  average_rating: number | null;
  total_reviews: number | null;
  created_at: string;
  updated_at: string;
}

export interface ExtendedCar extends Car {
  owner: Profile;
  average_rating: number | null;
  total_reviews: number | null;
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

export interface AdminStats {
  totalUsers: number;
  totalCars: number;
  totalBookings: number;
  pendingVerifications: number;
  activeRentals: number;
  monthlyRevenue: number;
  monthlyBookings: number;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  user_id: string | null;
  car_id: string | null;
  booking_id: string | null;
  action: 'verify_user' | 'reject_user' | 'suspend_user' | 'unsuspend_user' | 
         'approve_car' | 'reject_car' | 'flag_car' | 
         'approve_booking' | 'reject_booking' | 'flag_booking';
  details: string | null;
  timestamp: string;
  created_at: string;
}
