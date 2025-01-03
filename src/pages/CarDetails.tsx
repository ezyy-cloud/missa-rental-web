import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCar, updateCar } from '../lib/cars';
import { BookingForm } from '../components/forms/BookingForm';
import { ListCarForm } from '../components/forms/ListCarForm';
import type { Car } from '@/types/car';
import { supabase } from '@/lib/supabase';

export default function CarDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  // Function to get signed URL
  const getSignedUrl = async (publicUrl: string) => {
    try {
      const bucket = 'car-listings';
      const path = publicUrl.split('/public/car-listings/')[1];
      if (!path) return publicUrl;

      const { data } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60); // 1 hour expiry

      return data?.signedUrl || publicUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return publicUrl;
    }
  };

  useEffect(() => {
    async function loadCar() {
      try {
        if (!id) return;
        setLoading(true);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Get car details
        const carData = await getCar(id);
        setCar(carData);
        
        // Check if user is owner
        setIsOwner(user?.id === carData.owner_id);
        
        // Get signed URL for the image
        if (carData.image) {
          const signedUrl = await getSignedUrl(carData.image);
          setImageUrl(signedUrl);
        }
      } catch (err) {
        setError('Failed to load car details');
        console.error('Error loading car:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCar();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex justify-center items-center">
        <div className="text-red-500">{error || 'Car not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={imageUrl || car.image}
              alt={car.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                console.error('Image failed to load:', imageUrl || car.image);
                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
            <div className="mt-8 space-y-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{car.name}</h1>
              <p className="text-gray-600 dark:text-gray-300">{car.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
                  <p className="text-gray-600 dark:text-gray-300">{car.location}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Price</h3>
                  <p className="text-gray-600 dark:text-gray-300">${car.price}/day</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Transmission</h3>
                  <p className="text-gray-600 dark:text-gray-300">{car.transmission}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Seats</h3>
                  <p className="text-gray-600 dark:text-gray-300">{car.seats}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            {isOwner ? (
              <div className="bg-white dark:bg-dark-lighter rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Your Car</h2>
                <ListCarForm 
                  initialData={car} 
                  onSubmit={async (data) => {
                    try {
                      if (!car?.id) return;
                      await updateCar(car.id, {
                        ...data,
                        description: data.description || '',
                        seats: data.seats,
                        transmission: data.transmission,
                        approval_status: car.approval_status
                      });
                      // Refresh the page to show updated data
                      window.location.reload();
                    } catch (error) {
                      console.error('Error updating car:', error);
                    }
                  }} 
                />
              </div>
            ) : (
              <BookingForm car={car} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}