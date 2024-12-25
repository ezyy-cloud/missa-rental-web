import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCar } from '../lib/cars';
import { BookingForm } from '../components/forms/BookingForm';
import type { Car } from '../types';

export default function CarDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCar() {
      try {
        if (!id) return;
        setLoading(true);
        const carData = await getCar(id);
        setCar(carData);
      } catch (err) {
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    }
    loadCar();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-red-500">{error || 'Car not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold mb-4">{car.name}</h1>
              <div className="space-y-4">
                <p className="text-gray-600">{car.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-gray-600">{car.location}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Price</h3>
                    <p className="text-2xl font-bold">${car.price}<span className="text-sm font-normal text-gray-600">/day</span></p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Make</h3>
                    <p className="text-gray-600">{car.make}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Model</h3>
                    <p className="text-gray-600">{car.model}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Year</h3>
                    <p className="text-gray-600">{car.year}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Transmission</h3>
                    <p className="text-gray-600">{car.transmission}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {car.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:sticky lg:top-6 h-fit">
            <BookingForm car={car} />
          </div>
        </div>
      </div>
    </div>
  );
}