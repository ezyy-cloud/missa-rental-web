-- Update profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS preferred_contact text CHECK (preferred_contact IN ('email', 'phone', 'both')),
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_account_id text,
ADD COLUMN IF NOT EXISTS is_owner boolean DEFAULT false;

-- Create cars table if not exists
CREATE TABLE IF NOT EXISTS cars (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    image text[],
    price decimal NOT NULL CHECK (price > 0),
    location text NOT NULL,
    make text NOT NULL,
    model text NOT NULL,
    year integer NOT NULL,
    color text,
    transmission text CHECK (transmission IN ('automatic', 'manual')),
    fuel_type text CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
    seats integer,
    mileage integer,
    features text[],
    availability_start timestamp with time zone,
    availability_end timestamp with time zone,
    status text DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'rented', 'unavailable')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create bookings table if not exists
CREATE TABLE IF NOT EXISTS bookings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    car_id uuid REFERENCES cars(id) ON DELETE CASCADE,
    renter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    total_price decimal NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Create reviews table if not exists
CREATE TABLE IF NOT EXISTS reviews (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    reviewee_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    car_id uuid REFERENCES cars(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    review_type text NOT NULL CHECK (review_type IN ('car', 'renter', 'owner')),
    created_at timestamp with time zone DEFAULT now()
);

-- Create messages table if not exists
CREATE TABLE IF NOT EXISTS messages (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Create notifications table if not exists
CREATE TABLE IF NOT EXISTS notifications (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false,
    data jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Create favorites table if not exists
CREATE TABLE IF NOT EXISTS favorites (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    car_id uuid REFERENCES cars(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (user_id, car_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cars_owner ON cars(owner_id);
CREATE INDEX IF NOT EXISTS idx_cars_location ON cars(location);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_bookings_car ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_reviews_car ON reviews(car_id);
CREATE INDEX IF NOT EXISTS idx_messages_booking ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- Add RLS policies
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Cars policies
CREATE POLICY "Cars are viewable by everyone" ON cars
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own cars" ON cars
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own cars" ON cars
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own cars" ON cars
    FOR DELETE USING (auth.uid() = owner_id);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (
        auth.uid() = renter_id OR 
        auth.uid() IN (
            SELECT owner_id FROM cars WHERE id = car_id
        )
    );

CREATE POLICY "Users can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Users can update their own bookings" ON bookings
    FOR UPDATE USING (
        auth.uid() = renter_id OR 
        auth.uid() IN (
            SELECT owner_id FROM cars WHERE id = car_id
        )
    );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON reviews
    FOR INSERT WITH CHECK (
        auth.uid() = reviewer_id AND
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE id = booking_id 
            AND (renter_id = auth.uid() OR car_id IN (
                SELECT id FROM cars WHERE owner_id = auth.uid()
            ))
        )
    );

-- Messages policies
CREATE POLICY "Users can view their own messages" ON messages
    FOR SELECT USING (
        auth.uid() = sender_id OR 
        auth.uid() = receiver_id
    );

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON favorites
    FOR ALL USING (auth.uid() = user_id);
