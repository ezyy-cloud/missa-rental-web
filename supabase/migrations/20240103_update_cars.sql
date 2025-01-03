-- Add type field to cars table
ALTER TABLE cars
ADD COLUMN type text CHECK (type IN ('Sedan', 'SUV', 'Sports Car', 'Luxury', 'Electric', 'Convertible', 'Van', 'Truck')) NOT NULL DEFAULT 'Sedan';

-- Update cars policy to allow public access
DROP POLICY IF EXISTS "Cars are viewable by everyone" ON cars;
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Bookings are viewable by everyone" ON bookings;

-- Create policies for public access
CREATE POLICY "Cars are viewable by everyone"
ON cars FOR SELECT
USING (true);

CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
USING (true);

CREATE POLICY "Bookings are viewable by everyone"
ON bookings FOR SELECT
USING (true);

-- Grant public access to tables
GRANT SELECT ON cars TO anon;
GRANT SELECT ON reviews TO anon;
GRANT SELECT ON bookings TO anon;

-- Allow public access to car-listings bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-listings', 'car-listings', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create policy to allow public to read from car-listings bucket
DROP POLICY IF EXISTS "Public can view car listings" ON storage.objects;

CREATE POLICY "Public can view car listings"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-listings');

-- Grant storage permissions to anonymous users
GRANT ALL ON storage.objects TO anon;