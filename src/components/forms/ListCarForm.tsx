import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '../ui/TextArea';
import { ImageUpload } from '@/components/ImageUpload';
import type { Car, CarType, CarStatus } from '@/types/car';
import { CAR_TYPES, CAR_STATUS } from '@/types/car';

type FormData = {
  name: string;
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  description: string;
  seats?: number;
  transmission?: 'automatic' | 'manual';
  type: CarType;
  status: CarStatus;
  image?: string;
}

export function ListCarForm({ 
  onSubmit,
  initialData
}: { 
  onSubmit: (data: Partial<Car>) => Promise<void>;
  initialData?: Partial<Car>;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || '',
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    price: initialData?.price || 0,
    location: initialData?.location || '',
    description: initialData?.description || '',
    seats: initialData?.seats,
    transmission: initialData?.transmission,
    type: (initialData?.type as CarType) || 'Sedan',
    status: (initialData?.status as CarStatus) || 'available',
    image: initialData?.image,
  });

  const handlePhotoUpload = (paths: string[]) => {
    setFormData(prev => ({ ...prev, image: paths[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const carData: Partial<Car> = {
        ...formData,
        image: formData.image,
      };

      await onSubmit(carData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2" htmlFor="photos">Photos</label>
        <ImageUpload
          onUpload={handlePhotoUpload}
          maxFiles={1}
          bucket="car-listings"
          initialImages={initialData?.image ? [initialData.image] : []}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2" htmlFor="name">Car Name</label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2" htmlFor="type">Car Type</label>
          <select
            id="type"
            value={formData.type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              setFormData({ 
                ...formData, 
                type: e.target.value as CarType
              })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-black dark:border-gray-600 dark:text-white"
            required
          >
            {CAR_TYPES.map((type: CarType) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2" htmlFor="make">Make</label>
          <Input
            id="make"
            value={formData.make}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, make: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2" htmlFor="model">Model</label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, model: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2" htmlFor="year">Year</label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2" htmlFor="price">Price per Day</label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2" htmlFor="location">Location</label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2" htmlFor="seats">Seats</label>
          <Input
            id="seats"
            type="number"
            value={formData.seats || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ 
                ...formData, 
                seats: e.target.value ? parseInt(e.target.value) : undefined 
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2" htmlFor="transmission">Transmission</label>
          <select
            id="transmission"
            value={formData.transmission || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              setFormData({ 
                ...formData, 
                transmission: e.target.value as Car['transmission']
              })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-black dark:border-gray-600 dark:text-white"
          >
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2" htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              setFormData({ 
                ...formData, 
                status: e.target.value as CarStatus
              })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-black dark:border-gray-600 dark:text-white"
            required
          >
            {CAR_STATUS.map((status: CarStatus) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Description
        </label>
        <TextArea
          placeholder="Describe your car"
          value={formData.description || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <Button
        type="submit"
        variant="yellow"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Saving...' : initialData ? 'Update Car' : 'List Car'}
      </Button>
    </form>
  );
}