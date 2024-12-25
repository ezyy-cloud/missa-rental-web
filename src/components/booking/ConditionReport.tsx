import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';

interface CarCondition {
  booking_id: string;
  type: 'pre' | 'post';
  exterior: string;
  interior: string;
  mechanical: string;
  fuel: string;
  mileage: number;
  photos: string[];
  notes: string;
}

interface ConditionReportProps {
  bookingId: string;
  type: 'pre' | 'post';
  onSubmit: (condition: CarCondition) => void;
}

export function ConditionReport({ bookingId, type, onSubmit }: ConditionReportProps) {
  const [condition, setCondition] = useState<CarCondition>({
    booking_id: bookingId,
    type,
    exterior: '',
    interior: '',
    mechanical: '',
    fuel: 'full',
    mileage: 0,
    photos: [],
    notes: '',
  });

  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      // TODO: Implement photo upload to storage
      const uploadedUrls: string[] = [];
      setCondition((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uploadedUrls],
      }));
    } catch (error) {
      console.error('Error uploading photos:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(condition);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {type === 'pre' ? 'Pre-Rental' : 'Post-Rental'} Condition Report
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Exterior Condition</h3>
          <TextArea
            value={condition.exterior}
            onChange={(e) => setCondition((prev) => ({ ...prev, exterior: e.target.value }))}
            placeholder="Describe any existing damage, scratches, or dents..."
            required
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Interior Condition</h3>
          <TextArea
            value={condition.interior}
            onChange={(e) => setCondition((prev) => ({ ...prev, interior: e.target.value }))}
            placeholder="Describe the condition of seats, dashboard, controls..."
            required
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Mechanical Condition</h3>
          <TextArea
            value={condition.mechanical}
            onChange={(e) => setCondition((prev) => ({ ...prev, mechanical: e.target.value }))}
            placeholder="Note any mechanical issues or concerns..."
            required
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Fuel Level</h3>
          <select
            value={condition.fuel}
            onChange={(e) => setCondition((prev) => ({ ...prev, fuel: e.target.value }))}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          >
            <option value="full">Full</option>
            <option value="3/4">3/4</option>
            <option value="1/2">1/2</option>
            <option value="1/4">1/4</option>
            <option value="empty">Empty</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Mileage</h3>
        <input
          type="number"
          value={condition.mileage}
          onChange={(e) => setCondition((prev) => ({ ...prev, mileage: parseInt(e.target.value) }))}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Photos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {condition.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Condition photo ${index + 1}`}
              className="w-full h-32 object-cover rounded-md"
            />
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="secondary"
            className="relative overflow-hidden"
            disabled={uploading}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Camera className="w-4 h-4 mr-2" />
            Add Photos
          </Button>
          {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Additional Notes</h3>
        <TextArea
          value={condition.notes}
          onChange={(e) => setCondition((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Any additional notes or comments..."
        />
      </div>

      <Button type="submit" variant="yellow" className="w-full">
        Submit {type === 'pre' ? 'Pre' : 'Post'}-Rental Report
      </Button>
    </form>
  );
}
