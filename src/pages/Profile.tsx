import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { useCarStore } from '@/stores/carStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import ProfileForm from '@/components/profile/ProfileForm';
import IdentityVerification from '@/components/profile/IdentityVerification';
import PaymentMethods from '@/components/profile/PaymentMethods';
import BookingsList from '@/components/profile/BookingsList';
import ListedCars from '@/components/profile/ListedCars';
import { AlertCircle, Star, MessageCircle } from 'lucide-react';

interface FormData {
  email: string;
  full_name: string;
  avatar_url: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, loading, initialized, updateProfile } = useAuthStore();
  const { userCars, fetchUserCars } = useCarStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    full_name: '',
    avatar_url: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: ''
  });

  useEffect(() => {
    if (initialized && !user) {
      navigate('/sign-in');
      return;
    }
  }, [user, initialized, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserCars();
    }
  }, [user, fetchUserCars]);

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || '',
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || '',
        phone: profile.phone || '',
        address_line1: profile.address_line1 || '',
        address_line2: profile.address_line2 || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || '',
        postal_code: profile.postal_code || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Form data before submission:', formData);
      const updateData = {
        email: formData.email || null,
        full_name: formData.full_name || null,
        avatar_url: formData.avatar_url || null,
        phone: formData.phone || null,
        address_line1: formData.address_line1 || null,
        address_line2: formData.address_line2 || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        postal_code: formData.postal_code || null
      };
      console.log('Update data:', updateData);
      await updateProfile(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const needsVerification = !profile?.id_number || profile.verification_status === 'pending';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Profile</h1>
        
        {needsVerification && (
          <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Verification Required
                </h3>
                <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                  Please complete your identity verification to access all features.
                </p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg border dark:border-gray-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              Profile
            </TabsTrigger>
            <TabsTrigger value="verification" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              Verification
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="cars" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              My Cars
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              Payments
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <ProfileForm
              profile={profile}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
            />
          </TabsContent>

          <TabsContent value="verification" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <IdentityVerification onComplete={() => {}} />
          </TabsContent>

          <TabsContent value="bookings" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <BookingsList bookings={[]} />
          </TabsContent>

          <TabsContent value="cars" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <ListedCars userCars={userCars} />
          </TabsContent>

          <TabsContent value="payments" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <PaymentMethods />
          </TabsContent>

          <TabsContent value="reviews" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reviews</h2>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profile.average_rating?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({profile.total_reviews || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* TODO: Add reviews list */}
                <div className="py-4 text-gray-500 dark:text-gray-400">
                  No reviews yet
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h2>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    0 unread
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* TODO: Add messages list */}
                <div className="py-4 text-gray-500 dark:text-gray-400">
                  No messages yet
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}