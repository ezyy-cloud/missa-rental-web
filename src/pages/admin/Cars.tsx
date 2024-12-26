import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter, MoreVertical, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Car } from '@/types';

const mockCars: (Car & { approval_status: 'pending' | 'approved' | 'rejected' })[] = [
  {
    id: '1',
    name: 'Toyota Camry',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 50,
    owner_id: '1',
    location: 'New York',
    status: 'available',
    approval_status: 'pending',
    created_at: '2023-12-01',
    updated_at: '2023-12-01',
    description: 'Well maintained family sedan',
    image: null,
    color: 'Silver',
    transmission: 'automatic',
    fuel_type: 'petrol',
    seats: 5,
    mileage: 15000,
    features: ['AC', 'Bluetooth', 'Backup Camera'],
    availability_start: '2024-01-01',
    availability_end: '2024-12-31',
    average_rating: 4.5,
    total_reviews: 10,
  },
  // Add more mock cars as needed
];

export function AdminCars() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const handleApproveCar = (carId: string) => {
    // Implement car approval logic
  };

  const handleRejectCar = (carId: string) => {
    // Implement car rejection logic
  };

  const handleFlagCar = (carId: string) => {
    // Implement car flagging logic
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Cars Management</h1>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Listed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockCars.map((car) => (
                <tr key={car.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {car.image && (
                        <img
                          className="h-10 w-10 rounded-full mr-3"
                          src={car.image}
                          alt={car.name}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {car.year} {car.make} {car.model}
                        </div>
                        <div className="text-sm text-gray-500">{car.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' +
                        (car.approval_status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : car.approval_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800')
                      }
                    >
                      {car.approval_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${car.price}/day
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {car.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(car.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {car.approval_status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApproveCar(car.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRejectCar(car.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFlagCar(car.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
