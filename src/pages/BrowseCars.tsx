import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCarStore } from '@/stores/carStore';
import { CarCard } from '@/components/cars/CarCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import type { CarType } from '@/types/car';
import { Filter, MapPin, Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const carTypes = ['Sedan', 'SUV', 'Sports Car', 'Luxury', 'Electric', 'Convertible', 'Van', 'Truck'] as const;

export default function BrowseCars() {
  const { cars, loading, fetchCars, checkAvailability } = useCarStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [selectedTypes, setSelectedTypes] = useState<CarType[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [availableCars, setAvailableCars] = useState<string[]>([]);

  // Fetch cars on mount
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Check availability when dates or cars change
  useEffect(() => {
    const checkAllCarsAvailability = async () => {
      if (startDate && endDate) {
        try {
          const availableCarIds: string[] = [];
          for (const car of cars) {
            const isAvailable = await checkAvailability(car.id, startDate, endDate);
            if (isAvailable) {
              availableCarIds.push(car.id);
            }
          }
          setAvailableCars(availableCarIds);
        } catch (error) {
          console.error('Error checking car availability:', error);
          setAvailableCars([]);
        }
      } else {
        // If no dates selected, all cars are potentially available
        setAvailableCars(cars.map(car => car.id));
      }
    };

    checkAllCarsAvailability();
  }, [cars, startDate, endDate, checkAvailability]);

  useEffect(() => {
    // Only update URL if any value has changed from URL params
    const currentLocation = searchParams.get('location') || '';
    const currentStartDate = searchParams.get('startDate') || '';
    const currentEndDate = searchParams.get('endDate') || '';
    const currentTypes = searchParams.get('types')?.split(',') || [];
    const currentMinPrice = parseInt(searchParams.get('minPrice') || '0');
    const currentMaxPrice = parseInt(searchParams.get('maxPrice') || '1000');

    // Check if values are different from URL
    const locationChanged = location !== currentLocation;
    const startDateChanged = startDate !== currentStartDate;
    const endDateChanged = endDate !== currentEndDate;
    const typesChanged = JSON.stringify(selectedTypes) !== JSON.stringify(currentTypes);
    const priceChanged = priceRange[0] !== currentMinPrice || priceRange[1] !== currentMaxPrice;

    if (locationChanged || startDateChanged || endDateChanged || typesChanged || priceChanged) {
      const params = new URLSearchParams();
      if (location) params.set('location', location);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','));
      if (priceRange[0] !== 0) params.set('minPrice', priceRange[0].toString());
      if (priceRange[1] !== 1000) params.set('maxPrice', priceRange[1].toString());
      
      setSearchParams(params);
    }
  }, [location, startDate, endDate, selectedTypes, priceRange, searchParams, setSearchParams]);

  // Initialize state from URL params only once on mount
  useEffect(() => {
    const location = searchParams.get('location') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '1000');

    setLocation(location);
    setStartDate(startDate);
    setEndDate(endDate);
    setSelectedTypes(types as CarType[]);
    setPriceRange([minPrice, maxPrice]);
  }, []); // Only run once on mount

  const filteredCars = cars.filter((car) => {
    // Location filter
    const matchesLocation = !location || car.location.toLowerCase().includes(location.toLowerCase());

    // Type filter
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(car.type);

    // Price filter
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];

    // Availability filter
    const matchesAvailability = !startDate || !endDate || availableCars.includes(car.id);

    return matchesLocation && matchesType && matchesPrice && matchesAvailability;
  });

  const handleTypeChange = (type: CarType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Helmet>
        <title>Browse Cars - Missa Rentals</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Section */}
          <div className="w-full md:w-64 space-y-6">
            <div className="flex items-center justify-between md:justify-start gap-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Dates</label>
                <div className="space-y-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Car Type</label>
                <div className="space-y-2">
                  {carTypes.map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeChange(type)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-200">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Price Range</label>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onChange={(value: [number, number]) => setPriceRange(value)}
                />
                <div className="flex justify-between mt-2 text-gray-700 dark:text-gray-200">
                  <span>${priceRange[0]}/day</span>
                  <span>${priceRange[1]}/day</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Available Cars</h1>
              <p className="text-gray-600 dark:text-gray-300">{filteredCars.length} cars found</p>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No cars found matching your criteria
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard
                    key={car.id}
                    id={car.id}
                    name={car.name}
                    image={car.image || null}
                    price={car.price}
                    rating={car.average_rating ?? null}
                    location={car.location}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}