import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import { ImageUpload } from '../ImageUpload';

export function ListCarForm() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePhotoUpload = (uploadedUrls: string[]) => {
    setPhotos((prev) => [...prev, ...uploadedUrls]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement form submission
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Make"
          placeholder="e.g., Toyota"
          required
        />
        <Input
          label="Model"
          placeholder="e.g., Camry"
          required
        />
        <Input
          label="Year"
          type="number"
          min={1900}
          max={new Date().getFullYear() + 1}
          required
        />
        <Input
          label="Price per day"
          type="number"
          min={0}
          step={0.01}
          required
        />
        <Input
          label="Deposit amount"
          type="number"
          min={0}
          step={0.01}
          required
        />
        <Input
          label="Location"
          placeholder="e.g., San Francisco, CA"
          required
        />
        <Input
          label="Number of seats"
          type="number"
          min={1}
          required
        />
        <Input
          label="License plate"
          required
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
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Rental Terms</h3>
        <TextArea
          placeholder="Specify your rental terms, including mileage limits, fuel policy, and any restrictions..."
          required
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Pickup/Return Details</h3>
        <TextArea
          placeholder="Specify pickup/return location and any special instructions..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Available From</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Available Until</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
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