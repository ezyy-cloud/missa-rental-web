import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { TextArea } from '../../components/ui/TextArea';

export default function SignUpPage() {
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Account Info
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Personal Info
    full_name: '',
    phone: '',
    avatar_url: '',
    bio: '',
    preferred_contact: 'email',
    
    // Step 3: Address
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    
    // Step 4: ID Verification
    id_type: '',
    id_number: '',
    id_expiry_date: '',
    id_country: '',
    id_front_url: '',
    id_back_url: '',
    
    // Step 5: Driver's License
    drivers_license_number: '',
    drivers_license_expiry: '',
    drivers_license_country: '',
    drivers_license_front_url: '',
    drivers_license_back_url: '',
    
    // Step 6: Additional Info
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    verification_status: 'pending'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUp(formData);
      navigate('/profile');
    } catch (err) {
      setError('Error creating account');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={formData.full_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
            <Select
              label="Preferred Contact Method"
              value={formData.preferred_contact}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, preferred_contact: e.target.value }))}
              options={[
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Phone' },
                { value: 'both', label: 'Both' }
              ]}
            />
            <TextArea
              label="Bio"
              value={formData.bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <Input
              label="Address"
              value={formData.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                required
              />
              <Input
                label="State/Province"
                value={formData.state}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                value={formData.postal_code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                required
              />
              <Input
                label="Country"
                value={formData.country}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                required
              />
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <Select
              label="ID Type"
              value={formData.id_type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, id_type: e.target.value }))}
              options={[
                { value: '', label: 'Select ID Type' },
                { value: 'passport', label: 'Passport' },
                { value: 'national_id', label: 'National ID' },
                { value: 'drivers_license', label: "Driver's License" },
                { value: 'residence_permit', label: 'Residence Permit' }
              ]}
              required
            />
            <Input
              label="ID Number"
              value={formData.id_number}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, id_number: e.target.value }))}
              required
            />
            <Input
              label="Expiry Date"
              type="date"
              value={formData.id_expiry_date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, id_expiry_date: e.target.value }))}
              required
            />
            <Input
              label="Issuing Country"
              value={formData.id_country}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, id_country: e.target.value }))}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Front of ID"
                type="file"
                accept="image/*"
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // TODO: Handle file upload and set id_front_url
                    console.log('Uploading front of ID:', file.name);
                  }
                }}
                required
              />
              <Input
                label="Back of ID"
                type="file"
                accept="image/*"
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // TODO: Handle file upload and set id_back_url
                    console.log('Uploading back of ID:', file.name);
                  }
                }}
                required
              />
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-4">
            <Input
              label="License Number"
              value={formData.drivers_license_number}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, drivers_license_number: e.target.value }))}
              required
            />
            <Input
              label="Expiry Date"
              type="date"
              value={formData.drivers_license_expiry}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, drivers_license_expiry: e.target.value }))}
              required
            />
            <Input
              label="Issuing Country"
              value={formData.drivers_license_country}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, drivers_license_country: e.target.value }))}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Front of License"
                type="file"
                accept="image/*"
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // TODO: Handle file upload and set drivers_license_front_url
                    console.log('Uploading front of license:', file.name);
                  }
                }}
                required
              />
              <Input
                label="Back of License"
                type="file"
                accept="image/*"
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // TODO: Handle file upload and set drivers_license_back_url
                    console.log('Uploading back of license:', file.name);
                  }
                }}
                required
              />
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-4">
            <Input
              label="Contact Name"
              value={formData.emergency_contact_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
              required
            />
            <Input
              label="Contact Phone"
              type="tel"
              value={formData.emergency_contact_phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
              required
            />
            <Input
              label="Relationship"
              value={formData.emergency_contact_relationship}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, emergency_contact_relationship: e.target.value }))}
              required
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Step {step} of 6
          </p>
        </div>

        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-2 w-2 rounded-full ${
                s === step
                  ? 'bg-primary'
                  : s < step
                  ? 'bg-gray-400 dark:bg-gray-500'
                  : 'bg-gray-200 dark:bg-dark-lighter'
              }`}
            />
          ))}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="bg-white dark:bg-dark-lighter shadow-sm rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {step === 1 && "Create your account"}
              {step === 2 && "Personal Information"}
              {step === 3 && "Address Information"}
              {step === 4 && "ID Verification"}
              {step === 5 && "Driver's License Information"}
              {step === 6 && "Emergency Contact"}
            </h2>
            {renderStep()}
          </div>

          <div className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                onClick={() => setStep(step - 1)}
                className="text-gray-700 dark:text-gray-200"
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              variant={step === 6 ? 'primary' : 'yellow'}
              disabled={loading}
            >
              {step === 6 ? (loading ? 'Creating Account...' : 'Create Account') : 'Next'}
            </Button>
          </div>

          <div className="text-center">
            <Link
              to="/sign-in"
              className="font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}