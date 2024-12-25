import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const TRENDING_LOCATIONS = [
  {
    id: 1,
    name: 'Miami',
    image: '/locations/miami.jpg',
    carCount: 234,
    averagePrice: 89,
  },
  {
    id: 2,
    name: 'Los Angeles',
    image: '/locations/los-angeles.jpg',
    carCount: 456,
    averagePrice: 95,
  },
  {
    id: 3,
    name: 'New York',
    image: '/locations/new-york.jpg',
    carCount: 567,
    averagePrice: 110,
  },
  {
    id: 4,
    name: 'Las Vegas',
    image: '/locations/las-vegas.jpg',
    carCount: 189,
    averagePrice: 75,
  },
];

export default function TrendingLocations() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2">Trending Locations</h2>
        <p className="text-gray-600 mb-8">Discover popular car rental spots across the country</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRENDING_LOCATIONS.map((location) => (
            <Link
              key={location.id}
              to={`/browse?location=${location.name}`}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={location.image}
                  alt={location.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <h3 className="text-xl font-semibold">{location.name}</h3>
                </div>
                <p className="text-sm opacity-90">{location.carCount} cars from ${location.averagePrice}/day</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
