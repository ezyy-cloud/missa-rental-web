import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { createBooking, checkCarAvailability } from '../../lib/api';
import type { Car } from '../../types';

interface BookingFormProps {
  car: Car;
}

export function BookingForm({ car }: BookingFormProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dates, setDates] = useState({
    startDate: '',
    endDate: ''
  });

  const calculateNumberOfDays = () => {
    if (!dates.startDate || !dates.endDate) return 0;
    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    return car.price * calculateNumberOfDays();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/sign-in', { state: { from: `/cars/${car.id}` } });
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if car is available for selected dates
      const isAvailable = await checkCarAvailability(
        car.id,
        dates.startDate,
        dates.endDate
      );

      if (!isAvailable) {
        setError('Car is not available for selected dates');
        return;
      }

      // Create booking
      await createBooking(
        car.id,
        dates.startDate,
        dates.endDate,
        calculateTotalPrice()
      );

      navigate('/bookings');
    } catch (err) {
      setError('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-black rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Book this car</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-900 dark:text-white">
            Start Date
          </label>
          <Input
            id="startDate"
            type="date"
            value={dates.startDate}
            onChange={(e) => setDates(prev => ({ ...prev, startDate: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-900 dark:text-white">
            End Date
          </label>
          <Input
            id="endDate"
            type="date"
            value={dates.endDate}
            onChange={(e) => setDates(prev => ({ ...prev, endDate: e.target.value }))}
            min={dates.startDate || new Date().toISOString().split('T')[0]}
            required
            className="mt-1"
          />
        </div>

        {calculateNumberOfDays() > 0 && (
          <div className="mt-4">
            <p className="text-gray-900 dark:text-white">
              Duration: {calculateNumberOfDays()} days
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              Total: ${calculateTotalPrice()}
            </p>
          </div>
        )}

        {error && (
          <div className="text-red-500 mt-2">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full text-black hover:text-black"
        >
          {loading ? 'Processing...' : 'Book Now'}
        </Button>
      </div>
    </form>
  );
}