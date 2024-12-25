import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProfileStore } from '../stores/profileStore';
import { useBookingStore } from '../stores/bookingStore';
import { useCarStore } from '../stores/carStore';
import { useReviewStore } from '../stores/reviewStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import ProfileForm from '../components/profile/ProfileForm';
import IdentityVerification from '../components/profile/IdentityVerification';
import PaymentMethods from '../components/profile/PaymentMethods';
import BookingsList from '../components/profile/BookingsList';
import ListedCars from '../components/profile/ListedCars';
import { Star, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, initialized } = useAuthStore();
  const { profile, fetchProfile, updateProfile } = useProfileStore();
  const { bookings, fetchBookings } = useBookingStore();
  const { userCars, fetchUserCars } = useCarStore();
  const { reviews, fetchReviews } = useReviewStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    avatar_url: '',
    bio: '',
    address: '',
    preferred_contact: 'email'
  });

  useEffect(() => {
    if (initialized && !user) {
      navigate('/signin');
      return;
    }

    if (user) {
      fetchProfile();
      fetchBookings();
      fetchUserCars();
      fetchReviews('user', user.id);
    }
  }, [user, initialized, navigate, fetchProfile, fetchBookings, fetchUserCars, fetchReviews]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        address: profile.address || '',
        preferred_contact: profile.preferred_contact || 'email'
      });
    }
  }, [profile]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

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
        
        <Tabs defaultValue={needsVerification ? "verification" : "profile"} className="space-y-8">
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="profile" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700">
              Profile
            </TabsTrigger>
            <TabsTrigger value="verification" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700">
              Verification
            </TabsTrigger>
            <TabsTrigger value="payment" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700">
              Payment
            </TabsTrigger>
            <TabsTrigger value="bookings" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="cars" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700">
              My Cars
            </TabsTrigger>
            <TabsTrigger value="reviews" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <ProfileForm 
              profile={profile} 
              isEditing={isEditing} 
              setIsEditing={setIsEditing} 
              formData={formData} 
              setFormData={setFormData} 
              handleSubmit={handleSubmit} 
            />
          </TabsContent>

          <TabsContent value="verification" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <IdentityVerification
              onComplete={() => fetchProfile()}
            />
          </TabsContent>

          <TabsContent value="payment" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <PaymentMethods />
          </TabsContent>

          <TabsContent value="bookings" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <BookingsList bookings={bookings} />
          </TabsContent>

          <TabsContent value="cars" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <ListedCars userCars={userCars} />
          </TabsContent>

          <TabsContent value="reviews" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
              ) : (
                <div className="grid gap-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating ? 'fill-current' : 'fill-none'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}