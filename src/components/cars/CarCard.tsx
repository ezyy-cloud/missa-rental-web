import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card, CardImage, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface CarCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  location: string;
}

export function CarCard({ id, name, image, price, rating, location }: CarCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
      <Link to={`/cars/${id}`}>
        <CardImage src={image} alt={name} />
        <CardContent>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-primary fill-current" />
              <span className="ml-1 text-gray-900 dark:text-white">{rating}</span>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">{location}</p>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">from</span>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${price}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/day</span>
              </p>
            </div>
            <Button variant="primary">View Details</Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}