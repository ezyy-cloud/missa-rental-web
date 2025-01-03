export type Profile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  id_type?: string;
  id_number?: string;
  id_expiry_date?: string;
  id_country?: string;
  drivers_license_number?: string;
  drivers_license_expiry?: string;
  drivers_license_country?: string;
  verification_status?: 'pending' | 'verified' | 'rejected';
};

export type Car = {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  description?: string;
  image?: string;
  owner_id: string;
  owner_profile?: Profile;
  approval_status: 'pending' | 'approved' | 'rejected';
  availability_status?: 'available' | 'booked' | 'maintenance';
  seats?: number;
  transmission?: 'automatic' | 'manual';
  features?: string[];
  average_rating?: number;
  total_trips?: number;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  car_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type SignedUrlResponse = {
  signedUrl: string;
} | null;

export type FileUploadOptions = {
  cacheControl?: string;
  contentType?: string;
  upsert?: boolean;
};
