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
      navigate('/signin', { state: { from: `/cars/${car.id}` } });
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

      // Redirect to profile page
      navigate('/profile', { 
        state: { message: 'Booking created successfully!' }
      });
    } catch (err) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Start Date"
          value={dates.startDate}
          onChange={(e) => setDates(prev => ({ ...prev, startDate: e.target.value }))}
          min={new Date().toISOString().split('T')[0]}
          required
        />
        <Input
          type="date"
          label="End Date"
          value={dates.endDate}
          onChange={(e) => setDates(prev => ({ ...prev, endDate: e.target.value }))}
          min={dates.startDate || new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Price per day</span>
          <span>${car.price}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Number of days</span>
          <span>{calculateNumberOfDays()}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${calculateTotalPrice()}</span>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Processing...' : 'Book Now'}
      </Button>

      {!user && (
        <p className="text-sm text-gray-600 text-center">
          Please sign in to book this car
        </p>
      )}
    </form>
  );
}