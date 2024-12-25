import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import type { Profile } from '../../types/supabase';
import { Camera } from 'lucide-react';

interface ProfileFormProps {
  profile: Profile | null;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  formData: {
    full_name: string;
    phone: string;
    avatar_url: string;
    bio: string;
    address: string;
    preferred_contact: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    full_name: string;
    phone: string;
    avatar_url: string;
    bio: string;
    address: string;
    preferred_contact: string;
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {formData.avatar_url ? (
                <img
                  src={formData.avatar_url}
                  alt={formData.full_name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-4xl text-gray-500 dark:text-gray-400">
                    {formData.full_name?.[0]}
                  </span>
                </div>
              )}
              <Button
                type="button"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full p-2"
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                <Camera className="w-4 h-4" />
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={formData.full_name}
              onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              required
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
            <Input
              label="Address"
              value={formData.address}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
            <Select
              label="Preferred Contact Method"
              value={formData.preferred_contact}
              onChange={e => setFormData(prev => ({ ...prev, preferred_contact: e.target.value }))}
              options={[
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Phone' },
                { value: 'both', label: 'Both' }
              ]}
            />
          </div>

          <div>
            <TextArea
              label="Bio"
              value={formData.bio}
              onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Save Changes
            </Button>
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
          
          {profile?.bio && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-lg mx-auto">
              {profile.bio}
            </p>
          )}

          {profile?.address && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {profile.address}
            </p>
          )}

          <Button onClick={() => setIsEditing(true)} variant="yellow">
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
}
