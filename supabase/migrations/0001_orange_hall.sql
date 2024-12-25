-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  -- KYC Information
  id_type TEXT CHECK (id_type IN ('passport', 'national_id', 'drivers_license')),
  id_number TEXT,
  id_expiry_date DATE,
  id_country TEXT,
  id_verified BOOLEAN DEFAULT FALSE,
  drivers_license_number TEXT,
  drivers_license_expiry DATE,
  drivers_license_country TEXT,
  drivers_license_verified BOOLEAN DEFAULT FALSE,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'submitted', 'verified', 'rejected')),
  kyc_submitted_at TIMESTAMPTZ,
  kyc_verified_at TIMESTAMPTZ,
  kyc_rejection_reason TEXT
);

-- Create a function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create a table for storing KYC documents
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  document_type TEXT CHECK (document_type IN ('passport', 'national_id', 'drivers_license', 'proof_of_address')),
  document_url TEXT NOT NULL,
  document_number TEXT,
  expiry_date DATE,
  issuing_country TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT
);

-- Create cars table
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image TEXT,
  transmission TEXT CHECK (transmission IN ('automatic', 'manual')),
  seats INTEGER,
  features TEXT[],
  availability_status TEXT CHECK (availability_status IN ('available', 'booked', 'maintenance', 'hidden')) DEFAULT 'available',
  average_rating DECIMAL DEFAULT 0,
  total_trips INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID REFERENCES cars(id) NOT NULL,
  renter_id UUID REFERENCES profiles(id) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_price DECIMAL NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) NOT NULL,
  car_id UUID REFERENCES cars(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  review_type TEXT CHECK (review_type IN ('car', 'renter', 'owner')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create favorite_cars table
CREATE TABLE favorite_cars (
  user_id UUID REFERENCES profiles(id) NOT NULL,
  car_id UUID REFERENCES cars(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (user_id, car_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_location ON cars(location);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_availability_status ON cars(availability_status);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON reviews(car_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Create foreign key indexes for better join performance
CREATE INDEX IF NOT EXISTS idx_cars_owner_id ON cars(owner_id);

-- Create views for better querying
CREATE OR REPLACE VIEW car_details AS
SELECT 
    c.*,
    p.full_name as owner_name,
    p.avatar_url as owner_avatar
FROM cars c
LEFT JOIN profiles p ON c.owner_id = p.id
WHERE (
    -- Show only available cars to the public
    c.availability_status = 'available'
    -- Or show all cars to the owner
    OR c.owner_id = auth.uid()
);

-- Create reviews view
CREATE OR REPLACE VIEW public_reviews AS
SELECT 
    r.*,
    p.full_name as reviewer_name,
    p.avatar_url as reviewer_avatar
FROM reviews r
LEFT JOIN profiles p ON r.reviewer_id = p.id;

-- Create user_cars view for profile page
CREATE OR REPLACE VIEW user_cars AS
SELECT 
    c.*,
    p.full_name as owner_name,
    p.avatar_url as owner_avatar
FROM cars c
LEFT JOIN profiles p ON c.owner_id = p.id;

-- Create user_bookings view
CREATE OR REPLACE VIEW user_bookings AS
SELECT 
    b.*,
    c.name as car_name,
    c.image as car_image,
    p.full_name as renter_name,
    p.avatar_url as renter_avatar
FROM bookings b
LEFT JOIN cars c ON b.car_id = c.id
LEFT JOIN profiles p ON b.renter_id = p.id;

-- Create user_reviews view
CREATE OR REPLACE VIEW user_reviews AS
SELECT 
    r.*,
    p1.full_name as reviewer_name,
    p1.avatar_url as reviewer_avatar,
    p2.full_name as reviewee_name,
    p2.avatar_url as reviewee_avatar,
    c.name as car_name,
    c.image as car_image
FROM reviews r
LEFT JOIN profiles p1 ON r.reviewer_id = p1.id
LEFT JOIN profiles p2 ON r.reviewee_id = p2.id
LEFT JOIN cars c ON r.car_id = c.id;

-- Grant permissions
GRANT SELECT ON car_details TO authenticated;
GRANT SELECT ON car_details TO anon;
GRANT SELECT ON public_reviews TO authenticated;
GRANT SELECT ON public_reviews TO anon;
GRANT SELECT ON user_cars TO authenticated;
GRANT SELECT ON user_bookings TO authenticated;
GRANT SELECT ON user_reviews TO authenticated;
GRANT SELECT ON cars TO authenticated;
GRANT SELECT ON bookings TO authenticated;
GRANT SELECT ON reviews TO authenticated;
GRANT SELECT ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Cars policies
CREATE POLICY "Users can view their own cars"
    ON cars FOR SELECT
    TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY "Users can view available cars"
    ON cars FOR SELECT
    TO public
    USING (availability_status = 'available');

-- Bookings policies
CREATE POLICY "Users can view their bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (
        renter_id = auth.uid() OR 
        car_id IN (
            SELECT id FROM cars WHERE owner_id = auth.uid()
        )
    );

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
    ON reviews FOR SELECT
    TO public
    USING (true);

-- Profiles policies
CREATE POLICY "Anyone can view profiles"
    ON profiles FOR SELECT
    TO public
    USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_cars_updated_at
    BEFORE UPDATE ON cars
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
