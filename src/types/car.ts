import type { Profile } from './index';

export const CAR_TYPES = [
  'Sedan',
  'SUV',
  'Sports Car',
  'Luxury',
  'Electric',
  'Convertible',
  'Van',
  'Truck'
] as const;

export type CarType = typeof CAR_TYPES[number];

export const CAR_STATUS = [
  'available',
  'maintenance',
  'rented',
  'unavailable'
] as const;

export type CarStatus = typeof CAR_STATUS[number];

export interface Car {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  location: string;
  make: string;
  model: string;
  year: number;
  transmission?: 'automatic' | 'manual';
  seats?: number;
  type: CarType;
  status: CarStatus;
  approval_status: 'pending' | 'approved' | 'rejected';
  average_rating?: number;
  total_reviews?: number;
  created_at: string;
  updated_at: string;
  owner?: Profile;
}
