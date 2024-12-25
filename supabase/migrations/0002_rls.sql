-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON cars TO authenticated;
GRANT ALL ON bookings TO authenticated;
GRANT ALL ON reviews TO authenticated;
GRANT ALL ON kyc_documents TO authenticated;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Cars policies
CREATE POLICY "Cars are viewable by everyone"
ON cars FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own cars"
ON cars FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own cars"
ON cars FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own cars"
ON cars FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Bookings policies
CREATE POLICY "Users can view their own bookings and bookings for their cars"
ON bookings FOR SELECT
TO authenticated
USING (
  auth.uid() = renter_id OR 
  auth.uid() IN (
    SELECT owner_id FROM cars WHERE id = car_id
  )
);

CREATE POLICY "Users can create their own bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Users can update their own bookings"
ON bookings FOR UPDATE
TO authenticated
USING (auth.uid() = renter_id)
WITH CHECK (auth.uid() = renter_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create reviews for their bookings"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = (
    SELECT renter_id FROM bookings WHERE id = booking_id
  )
);

CREATE POLICY "Users can update their own reviews"
ON reviews FOR UPDATE
TO authenticated
USING (auth.uid() = reviewer_id)
WITH CHECK (auth.uid() = reviewer_id);

-- KYC Documents policies
CREATE POLICY "Users can view their own KYC documents"
ON kyc_documents FOR SELECT
TO authenticated
USING (auth.uid() = profile_id);

CREATE POLICY "Users can upload their own KYC documents"
ON kyc_documents FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own KYC documents"
ON kyc_documents FOR UPDATE
TO authenticated
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own KYC documents"
ON kyc_documents FOR DELETE
TO authenticated
USING (auth.uid() = profile_id);
