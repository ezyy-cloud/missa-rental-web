import { Button } from '../ui/Button';
import { CarCard } from '../cars/CarCard';
import { Link } from 'react-router-dom';
import type { Car } from '../../types/supabase';

interface ListedCarsProps {
  userCars: Car[];
}

export default function ListedCars({ userCars }: ListedCarsProps) {
  if (userCars.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You haven't listed any cars yet</p>
        <Link to="/list-car">
          <Button className="mt-4">List Your First Car</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userCars.map((car) => (
        <CarCard
          key={car.id}
          id={car.id}
          name={car.name}
          image={car.image || ''}
          price={car.price}
          rating={car.average_rating}
          location={car.location}
        />
      ))}
    </div>
  );
}
