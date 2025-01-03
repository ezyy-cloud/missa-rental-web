import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { supabase } from '@/lib/supabase';

interface CarCardProps {
  id: string;
  name: string;
  image: string | null;
  price: number;
  rating: number | null;
  location: string;
}

export function CarCard({ id, name, image, price, rating, location }: CarCardProps) {
  // Function to convert a public URL to a signed URL
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

  // Use state to store the signed URL
  const [signedUrl, setSignedUrl] = useState(image || '');

  // Get signed URL when image prop changes
  useEffect(() => {
    if (image) {
      getSignedUrl(image).then(setSignedUrl);
    }
  }, [image]);

  return (
    <Card className="bg-white dark:bg-dark-lighter rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/cars/${id}`}>
        <div className="relative h-48">
          <img
            src={signedUrl || '/placeholder-car.jpg'}
            alt={name}
            className="w-full h-full object-cover"
          />
          {typeof rating === 'number' && (
            <div className="absolute top-2 right-2 bg-white dark:bg-black rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{name}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{location}</p>
          <p className="text-primary font-bold">${price.toFixed(2)}/day</p>
        </CardContent>
      </Link>
    </Card>
  );
}