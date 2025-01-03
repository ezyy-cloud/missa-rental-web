import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { Profile } from '../../types/supabase';
import { Camera } from 'lucide-react';

interface ProfileFormProps {
  profile: Profile | null;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  formData: {
    full_name: string;
    email: string;
    phone: string;
    avatar_url: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    full_name: string;
    email: string;
    phone: string;
    avatar_url: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  }>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function ProfileForm({
  profile,
  isEditing,
  setIsEditing,
  formData,
  setFormData,
  handleSubmit
}: ProfileFormProps) {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // TODO: Implement image upload to storage
      const imageUrl = '';
      setFormData(prev => ({ ...prev, avatar_url: imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="p-6">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={formData.avatar_url || '/default-avatar.png'}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
              <label className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="w-4 h-4" />
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                disabled={!isEditing}
                required
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Input
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                type="email"
                required
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
                type="tel"
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Address Line 1"
                  value={formData.address_line1}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_line1: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Street address"
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Address Line 2"
                  value={formData.address_line2}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_line2: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Apartment, suite, unit, etc."
                />
              </div>
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                disabled={!isEditing}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Input
                label="State/Province"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                disabled={!isEditing}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Input
                label="Postal Code"
                value={formData.postal_code}
                onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                disabled={!isEditing}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Input
                label="Country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                disabled={!isEditing}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || ''}
                className="w-32 h-32 rounded-full mx-auto object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-4xl text-gray-500 dark:text-gray-400">
                  {profile?.full_name?.[0]}
                </span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {profile?.full_name || 'No name set'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{profile?.email}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{profile?.phone || 'No phone set'}</p>

          {(profile?.address_line1 || profile?.address_line2) && (
            <div className="text-gray-600 dark:text-gray-400 mb-4">
              {profile.address_line1 && <p>{profile.address_line1}</p>}
              {profile.address_line2 && <p>{profile.address_line2}</p>}
              {profile.city && <p>{profile.city}, {profile.state} {profile.postal_code}</p>}
              {profile.country && <p>{profile.country}</p>}
            </div>
          )}

          <Button onClick={() => setIsEditing(true)} variant="yellow">
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
}
