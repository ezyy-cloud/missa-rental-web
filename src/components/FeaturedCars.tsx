import { useEffect } from 'react';
import { CarCard } from './cars/CarCard';
import { useCarStore } from '../stores/carStore';

export default function FeaturedCars() {
  const { cars, loading, fetchCars } = useCarStore();

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return (
    <section className="py-12 bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured Cars</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.slice(0, 6).map((car) => (
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
      </div>
    </section>
  );
}