import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuthStore } from '@/stores/auth';
import type { CarType } from '@/types/car';

const carTypes = ['Sedan', 'SUV', 'Sports Car', 'Luxury', 'Electric', 'Convertible', 'Van', 'Truck'] as const;

export default function Hero() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedType, setSelectedType] = useState<CarType | ''>('');

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchLocation) searchParams.set('location', searchLocation);
    if (selectedType) searchParams.set('types', selectedType);
    
    navigate(`/cars?${searchParams.toString()}`);
  };

  return (
    <div className="relative h-[600px] flex items-center">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&q=80"
          alt="Luxury car"
          className="w-full h-full object-cover brightness-50"
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-6">
            Rent the Perfect Car
            <span className="text-primary"> Anytime, Anywhere</span>
          </h1>
          <p className="text-gray-200 text-xl mb-8">
            Connect with local car owners and rent the perfect vehicle for your next adventure
          </p>
          
          <div className="bg-white dark:bg-black p-4 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Location</label>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Enter your location"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Car Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as CarType)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-black text-gray-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  {carTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button variant="yellow" className="flex items-center" onClick={handleSearch}>
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            {!user && (
              <Link to="/sign-up">
                <Button variant="yellow" size="lg">Get Started</Button>
              </Link>
            )}
            {user && (
              <Link to="/list-car">
                <Button variant="secondary" size="lg">List Your Car</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}