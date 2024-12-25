import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarStore } from '../stores/carStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Helmet } from 'react-helmet-async';
import { Trophy, AlertCircle } from 'lucide-react';

const CAR_TYPES = [
  'Sedan', 'SUV', 'Sports Car', 'Luxury', 'Electric',
  'Convertible', 'Van', 'Truck'
] as const;

export default function ListCarPage() {
  const navigate = useNavigate();
  const { createCar } = useCarStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: '',
    price: '',
    location: '',
    description: '',
    transmission: 'automatic',
    seats: '',
    features: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createCar({
        ...formData,
        price: Number(formData.price),
        seats: Number(formData.seats),
      });
      navigate('/profile');
    } catch (error) {
      console.error('Error creating car listing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>List Your Car - MissaRental</title>
        <meta
          name="description"
          content="List your car on MissaRental and start earning. Easy listing process, secure payments, and insurance coverage."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              List Your Car
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Share your car and start earning. It only takes a few minutes to create a listing.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-6">
              <Trophy className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                  Become a Top Host
                </h3>
                <p className="text-blue-600 dark:text-blue-200 text-sm">
                  List multiple cars and maintain a high rating to unlock exclusive benefits and earn more.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Car Name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Tesla Model 3 2022"
                />
                <Input
                  label="Make"
                  type="text"
                  required
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  placeholder="e.g., Tesla"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Model"
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g., Model 3"
                />
                <Input
                  label="Year"
                  type="number"
                  required
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Car Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a type</option>
                    {CAR_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Daily Price ($)"
                  type="number"
                  required
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 150"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Los Angeles, CA"
                />
                <Input
                  label="Number of Seats"
                  type="number"
                  required
                  min={1}
                  max={15}
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                  placeholder="Describe your car, its features, and any special rules..."
                  required
                />
              </div>

              <div className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div className="text-sm">
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">
                    Important Notice
                  </h4>
                  <p className="text-yellow-600 dark:text-yellow-200">
                    Make sure your car meets our requirements and you have all necessary documentation ready.
                    This includes registration, insurance, and recent maintenance records.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  className="dark:bg-gray-700 dark:text-gray-200"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating Listing...' : 'Create Listing'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}