import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Slider } from '../components/ui/Slider';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CarCard } from '../components/cars/CarCard';
import { useCarStore } from '../stores/carStore';
import { Filter, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const CAR_TYPES = [
  'Sedan', 'SUV', 'Sports Car', 'Luxury', 'Electric',
  'Convertible', 'Van', 'Truck'
] as const;

export default function BrowseCarsPage() {
  const [searchParams] = useSearchParams();
  const { cars, loading, fetchCars } = useCarStore();
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<typeof CAR_TYPES[number][]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [location, setLocation] = useState(searchParams.get('location') || '');

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const filteredCars = cars.filter(car => {
    if (selectedTypes.length && !selectedTypes.includes(car.type)) return false;
    if (car.price < priceRange[0] || car.price > priceRange[1]) return false;
    if (location && !car.location.toLowerCase().includes(location.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Browse Cars - MissaRental</title>
        <meta name="description" content="Browse our selection of cars available for rent. Filter by type, price, and location to find your perfect ride." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse Cars</h1>
              <p className="text-gray-600 dark:text-gray-300">Find your perfect ride</p>
            </div>
            <Button
              variant="yellow"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            {showFilters && (
              <div className="lg:col-span-1 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="pl-10"
                          placeholder="Enter location"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Price Range
                      </label>
                      <Slider
                        min={0}
                        max={1000}
                        step={50}
                        value={priceRange}
                        onChange={setPriceRange}
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-300">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Car Type
                      </label>
                      <div className="space-y-2">
                        {CAR_TYPES.map((type) => (
                          <label
                            key={type}
                            className="flex items-center space-x-2 text-gray-700 dark:text-gray-200"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTypes.includes(type)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTypes([...selectedTypes, type]);
                                } else {
                                  setSelectedTypes(selectedTypes.filter(t => t !== type));
                                }
                              }}
                              className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                            />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Car Grid */}
            <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {filteredCars.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">No cars found matching your criteria.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredCars.map((car) => (
                        <CarCard
                          key={car.id}
                          id={car.id}
                          name={car.name}
                          image={car.image || '/default-car-image.jpg'}
                          price={car.price}
                          rating={car.rating}
                          location={car.location}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}