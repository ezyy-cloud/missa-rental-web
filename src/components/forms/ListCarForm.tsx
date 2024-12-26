import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import { ImageUpload } from '../ImageUpload';
import { useCarStore } from '../../stores/carStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export function ListCarForm() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createCar } = useCarStore();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    deposit: 0,
    location: '',
    seats: 4,
    licensePlate: '',
    description: '',
    rentalTerms: '',
    pickupDetails: '',
    availabilityStart: '',
    availabilityEnd: '',
  });

  const handlePhotoUpload = (uploadedUrls: string[]) => {
    setPhotos((prev) => [...prev, ...uploadedUrls]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await createCar({
        owner_id: user.id,
        name: `${formData.make} ${formData.model}`,
        description: formData.description,
        image: photos[0] || null,
        price: Number(formData.price),
        location: formData.location,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        seats: Number(formData.seats),
        features: [],
        availability_start: formData.availabilityStart,
        availability_end: formData.availabilityEnd,
        status: 'available',
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Error creating car listing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Make"
          placeholder="e.g., Toyota"
          required
          name="make"
          value={formData.make}
          onChange={handleChange}
        />
        <Input
          label="Model"
          placeholder="e.g., Camry"
          required
          name="model"
          value={formData.model}
          onChange={handleChange}
        />
        <Input
          label="Year"
          type="number"
          min={1900}
          max={new Date().getFullYear() + 1}
          required
          name="year"
          value={formData.year}
          onChange={handleChange}
        />
        <Input
          label="Price per day"
          type="number"
          min={0}
          step={0.01}
          required
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        <Input
          label="Deposit amount"
          type="number"
          min={0}
          step={0.01}
          required
          name="deposit"
          value={formData.deposit}
          onChange={handleChange}
        />
        <Input
          label="Location"
          placeholder="e.g., San Francisco, CA"
          required
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
        <Input
          label="Number of seats"
          type="number"
          min={1}
          required
          name="seats"
          value={formData.seats}
          onChange={handleChange}
        />
        <Input
          label="License plate"
          required
          name="licensePlate"
          value={formData.licensePlate}
          onChange={handleChange}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Vehicle Photos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Vehicle photo ${index + 1}`}
              className="w-full h-32 object-cover rounded-md"
            />
          ))}
        </div>
        <ImageUpload onUpload={handlePhotoUpload} maxFiles={8} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Vehicle Description</h3>
        <TextArea
          placeholder="Describe your vehicle, including features, condition, and any special notes..."
          required
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Rental Terms</h3>
        <TextArea
          placeholder="Specify your rental terms, including mileage limits, fuel policy, and any restrictions..."
          required
          name="rentalTerms"
          value={formData.rentalTerms}
          onChange={handleChange}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Pickup/Return Details</h3>
        <TextArea
          placeholder="Specify pickup/return location and any special instructions..."
          required
          name="pickupDetails"
          value={formData.pickupDetails}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Available From</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
            name="availabilityStart"
            value={formData.availabilityStart}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Available Until</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
            name="availabilityEnd"
            value={formData.availabilityEnd}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="yellow"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Creating Listing...' : 'List Your Car'}
      </Button>
    </form>
  );
}