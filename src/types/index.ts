import type { Car } from './car';

export type { Car, CarType, CarStatus } from './car';
export { CAR_TYPES, CAR_STATUS } from './car';

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
  suspended_at: string | null;
}

export interface Review {
  id: string;
  car_id: string;
  reviewer_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  reviewer?: Profile;
  car?: Car;
}

export interface FavoriteCar {
  user_id: string;
  car_id: string;
  created_at: string;
  car?: Car;
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
  renter?: Profile;
  reviews?: Review[];
  messages?: Message[];
}

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
  booking?: Booking;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  data: Record<string, any> | null;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  total_cars: number;
  total_bookings: number;
  total_revenue: number;
  new_users_last_month: number;
  new_cars_last_month: number;
  new_bookings_last_month: number;
  revenue_last_month: number;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: 'verify_user' | 'suspend_user' | 'approve_car' | 'reject_car' | 'flag_car';
  target_id: string;
  reason: string | null;
  created_at: string;
  admin?: Profile;
}