import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function SignUpPage() {
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    
    // Step 2: Address
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    
    // Step 3: ID Verification
    id_type: '',
    id_number: '',
    id_expiry_date: '',
    id_country: '',
    
    // Step 4: Driver's License
    drivers_license_number: '',
    drivers_license_expiry: '',
    drivers_license_country: '',
    
    // Step 5: Emergency Contact
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: ''
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Step {step} of 5
          </p>
        </div>

        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 w-2 rounded-full ${
                s === step
                  ? 'bg-primary'
                  : s < step
                  ? 'bg-gray-400 dark:bg-gray-500'
                  : 'bg-gray-200 dark:bg-gray-700'
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

          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 space-y-4">
            {step === 1 && (
              <>
                <Input
                  label="Full Name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
                <Input
                  label="Email address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Phone number"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  label="Password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </>
            )}

            {step === 2 && (
              <>
                <Input
                  label="Address Line 1"
                  type="text"
                  required
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                />
                <Input
                  label="Address Line 2"
                  type="text"
                  value={formData.address_line2}
                  onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <Input
                    label="State/Province"
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Postal Code"
                    type="text"
                    required
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  />
                  <Input
                    label="Country"
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <Input
                  label="ID Type"
                  type="text"
                  required
                  value={formData.id_type}
                  onChange={(e) => setFormData({ ...formData, id_type: e.target.value })}
                />
                <Input
                  label="ID Number"
                  type="text"
                  required
                  value={formData.id_number}
                  onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                />
                <Input
                  label="ID Expiry Date"
                  type="date"
                  required
                  value={formData.id_expiry_date}
                  onChange={(e) => setFormData({ ...formData, id_expiry_date: e.target.value })}
                />
                <Input
                  label="ID Issuing Country"
                  type="text"
                  required
                  value={formData.id_country}
                  onChange={(e) => setFormData({ ...formData, id_country: e.target.value })}
                />
              </>
            )}

            {step === 4 && (
              <>
                <Input
                  label="Driver's License Number"
                  type="text"
                  required
                  value={formData.drivers_license_number}
                  onChange={(e) => setFormData({ ...formData, drivers_license_number: e.target.value })}
                />
                <Input
                  label="License Expiry Date"
                  type="date"
                  required
                  value={formData.drivers_license_expiry}
                  onChange={(e) => setFormData({ ...formData, drivers_license_expiry: e.target.value })}
                />
                <Input
                  label="License Issuing Country"
                  type="text"
                  required
                  value={formData.drivers_license_country}
                  onChange={(e) => setFormData({ ...formData, drivers_license_country: e.target.value })}
                />
              </>
            )}

            {step === 5 && (
              <>
                <Input
                  label="Emergency Contact Name"
                  type="text"
                  required
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                />
                <Input
                  label="Emergency Contact Phone"
                  type="tel"
                  required
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                />
                <Input
                  label="Relationship to Emergency Contact"
                  type="text"
                  required
                  value={formData.emergency_contact_relationship}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_relationship: e.target.value })}
                />
              </>
            )}
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
              variant={step === 5 ? 'primary' : 'yellow'}
              disabled={loading}
            >
              {step === 5 ? (loading ? 'Creating Account...' : 'Create Account') : 'Next'}
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