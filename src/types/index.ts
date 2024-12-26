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
  role: 'user' | 'admin' | null;
  last_login: string | null;
  is_suspended: boolean;
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
  status: 'available' | 'unavailable' | 'maintenance' | 'pending_approval' | 'rejected';
  approval_status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  inspection_date: string | null;
  insurance_expiry: string | null;
  owner?: Profile;
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

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  car_id: string | null;
  rating: number;
  comment: string | null;
  review_type: 'car' | 'renter' | 'owner';
  created_at: string;
  reviewer?: Profile;
  reviewee?: Profile;
  car?: Car;
  booking?: Booking;
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

export interface FavoriteCar {
  user_id: string;
  car_id: string;
  created_at: string;
  car?: Car;
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