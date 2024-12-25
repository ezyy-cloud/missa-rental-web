import React, { useState, ChangeEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useProfileStore } from '../../stores/profileStore';
import { Camera, Upload } from 'lucide-react';

interface IdentityVerificationProps {
  onComplete: () => void;
}

export default function IdentityVerification({ onComplete }: IdentityVerificationProps) {
  const { profile, updateProfile } = useProfileStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    id_type: profile?.id_type || '',
    id_number: profile?.id_number || '',
    id_expiry_date: profile?.id_expiry_date || '',
    id_country: profile?.id_country || '',
    drivers_license_number: profile?.drivers_license_number || '',
    drivers_license_expiry: profile?.drivers_license_expiry || '',
    drivers_license_country: profile?.drivers_license_country || '',
  });
  const [files, setFiles] = useState<{
    id_front?: File;
    id_back?: File;
    drivers_license_front?: File;
    drivers_license_back?: File;
    selfie?: File;
  }>({});

  const handleFileUpload = (type: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement file upload to storage
      // TODO: Call verification service API
      await updateProfile({
        ...formData,
        verification_status: 'pending' as const,
      });
      onComplete();
    } catch (error) {
      console.error('Error submitting verification:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Identity Verification
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please complete the verification process to start using our service
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-1/3 h-2 rounded-full mx-1 ${
                s <= step ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <form className="space-y-6">
          <Select
            label="ID Type"
            value={formData.id_type}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, id_type: e.target.value }))
            }
            options={[
              { value: 'passport', label: 'Passport' },
              { value: 'national_id', label: 'National ID' },
              { value: 'drivers_license', label: 'Driver\'s License' },
            ]}
            required
          />
          <Input
            label="ID Number"
            value={formData.id_number}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, id_number: e.target.value }))
            }
            required
          />
          <Input
            type="date"
            label="ID Expiry Date"
            value={formData.id_expiry_date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, id_expiry_date: e.target.value }))
            }
            required
          />
          <Input
            label="ID Issuing Country"
            value={formData.id_country}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, id_country: e.target.value }))
            }
            required
          />
          <Button
            type="button"
            variant="yellow"
            className="w-full"
            onClick={() => setStep(2)}
          >
            Next
          </Button>
        </form>
      )}

      {step === 2 && (
        <form className="space-y-6">
          <Input
            label="Driver's License Number"
            value={formData.drivers_license_number}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                drivers_license_number: e.target.value,
              }))
            }
            required
          />
          <Input
            type="date"
            label="Driver's License Expiry"
            value={formData.drivers_license_expiry}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                drivers_license_expiry: e.target.value,
              }))
            }
            required
          />
          <Input
            label="Driver's License Country"
            value={formData.drivers_license_country}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                drivers_license_country: e.target.value,
              }))
            }
            required
          />
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="yellow"
              className="flex-1"
              onClick={() => setStep(3)}
            >
              Next
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ID Front
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                {files.id_front ? (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {files.id_front.name}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload('id_front')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ID Back
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                {files.id_back ? (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {files.id_back.name}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload('id_back')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Driver's License Front
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                {files.drivers_license_front ? (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {files.drivers_license_front.name}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload('drivers_license_front')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Driver's License Back
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                {files.drivers_license_back ? (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {files.drivers_license_back.name}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload('drivers_license_back')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selfie with ID
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                {files.selfie ? (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {files.selfie.name}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Take a selfie or upload
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleFileUpload('selfie')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(2)}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="yellow"
              className="flex-1"
            >
              Submit Verification
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
