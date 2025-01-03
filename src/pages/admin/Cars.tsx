import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { Car, SignedUrlResponse } from '@/types';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/stores/admin';
import { supabase } from '@/lib/supabase';

export function AdminCars() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const { approveCar, rejectCar, flagCar } = useAdminStore();

  // Function to get signed URL
  const getSignedUrl = async (publicUrl: string) => {
    try {
      const bucket = 'car-listings';
      const path = publicUrl.split('/public/car-listings/')[1];
      if (!path) return publicUrl;

      const { data } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60) as { data: SignedUrlResponse }; // 1 hour expiry

      return data?.signedUrl || publicUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return publicUrl;
    }
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      let query = supabase.from('cars').select(`
        *,
        owner_profile:profiles!cars_owner_id_fkey(*)
      `);

      // Apply filter
      if (filter === 'pending') {
        query = query.eq('approval_status', 'pending');
      } else if (filter === 'approved') {
        query = query.eq('approval_status', 'approved');
      } else if (filter === 'rejected') {
        query = query.eq('approval_status', 'rejected');
      }

      // Apply search
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,make.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Ensure all cars have an approval_status
      const carsWithStatus = (data || []).map(car => ({
        ...car,
        approval_status: car.approval_status || 'pending'
      }));

      setCars(carsWithStatus);

      // Get signed URLs for all car images
      const urls: Record<string, string> = {};
      await Promise.all(
        carsWithStatus.map(async (car) => {
          if (car.image) {
            urls[car.id] = await getSignedUrl(car.image);
          }
        })
      );
      setImageUrls(urls);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filter, searchTerm]);

  const handleApproveCar = async (carId: string) => {
    try {
      await approveCar(carId);
      await fetchCars();
    } catch (error) {
      console.error('Error approving car:', error);
    }
  };

  const handleRejectCar = async (carId: string) => {
    try {
      const reason = prompt('Please enter a reason for rejection:');
      if (reason) {
        await rejectCar(carId, reason);
        await fetchCars();
      }
    } catch (error) {
      console.error('Error rejecting car:', error);
    }
  };

  const handleFlagCar = async (carId: string) => {
    try {
      const reason = prompt('Please enter a reason for flagging:');
      if (reason) {
        await flagCar(carId, reason);
        await fetchCars();
      }
    } catch (error) {
      console.error('Error flagging car:', error);
    }
  };

  const getStatusText = (status?: string) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'outline' : 'secondary'}
            onClick={() => setFilter('all')}
            className="text-black"
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'outline' : 'secondary'}
            onClick={() => setFilter('pending')}
            className="text-black"
          >
            Pending
          </Button>
          <Button
            variant={filter === 'approved' ? 'outline' : 'secondary'}
            onClick={() => setFilter('approved')}
            className="text-black"
          >
            Approved
          </Button>
          <Button
            variant={filter === 'rejected' ? 'outline' : 'secondary'}
            onClick={() => setFilter('rejected')}
            className="text-black"
          >
            Rejected
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No cars found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <img
                src={imageUrls[car.id] || car.image}
                alt={car.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrls[car.id] || car.image);
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{car.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{car.owner_profile?.full_name}</p>
                  </div>
                  <div className="flex gap-2">
                    {(car.approval_status === 'pending' || !car.approval_status) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveCar(car.id)}
                          className="bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectCar(car.id)}
                          className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
                        >
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFlagCar(car.id)}
                      className="bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800"
                    >
                      <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Make:</span>{' '}
                    <span className="text-gray-700 dark:text-gray-300">{car.make}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Model:</span>{' '}
                    <span className="text-gray-700 dark:text-gray-300">{car.model}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Year:</span>{' '}
                    <span className="text-gray-700 dark:text-gray-300">{car.year}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Price:</span>{' '}
                    <span className="text-gray-700 dark:text-gray-300">${car.price}/day</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      car.approval_status === 'approved' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                      (car.approval_status === 'pending' || !car.approval_status) && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                      car.approval_status === 'rejected' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    )}
                  >
                    {getStatusText(car.approval_status)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
