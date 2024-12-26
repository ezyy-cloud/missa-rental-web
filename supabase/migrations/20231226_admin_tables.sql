-- Add admin fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user',
ADD COLUMN IF NOT EXISTS last_login timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_suspended boolean DEFAULT false;

-- Add approval fields to cars table
ALTER TABLE cars
ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS rejection_reason text,
ADD COLUMN IF NOT EXISTS inspection_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS insurance_expiry timestamp with time zone;

-- Create admin_actions table for audit logs
CREATE TABLE IF NOT EXISTS admin_actions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type text NOT NULL,
    target_id text NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Add RLS policies for admin_actions
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view all actions"
    ON admin_actions FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

CREATE POLICY "Only admins can insert actions"
    ON admin_actions FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

-- Update car status enum
ALTER TABLE cars DROP CONSTRAINT IF EXISTS cars_status_check;
ALTER TABLE cars ADD CONSTRAINT cars_status_check 
    CHECK (status IN ('available', 'unavailable', 'maintenance', 'pending_approval', 'rejected'));

-- Create platform_settings table
CREATE TABLE IF NOT EXISTS platform_settings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    commission_rate numeric NOT NULL DEFAULT 10,
    minimum_rental_duration integer NOT NULL DEFAULT 1,
    maximum_rental_duration integer NOT NULL DEFAULT 30,
    platform_name text NOT NULL DEFAULT 'Missa Rental',
    support_email text NOT NULL DEFAULT 'support@missarental.com',
    terms_of_service text,
    privacy_policy text,
    maintenance_mode boolean NOT NULL DEFAULT false,
    require_id_verification boolean NOT NULL DEFAULT true,
    require_car_insurance boolean NOT NULL DEFAULT true,
    auto_approve_verified_owners boolean NOT NULL DEFAULT false,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for platform_settings
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view settings"
    ON platform_settings FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

CREATE POLICY "Only admins can update settings"
    ON platform_settings FOR UPDATE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

-- Insert default settings
INSERT INTO platform_settings (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Update booking status enum
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));

-- Create admin functions
CREATE OR REPLACE FUNCTION approve_car(car_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only admins can approve cars';
    END IF;

    -- Update car status
    UPDATE cars
    SET approval_status = 'approved',
        status = 'available'
    WHERE id = car_id;
END;
$$;

CREATE OR REPLACE FUNCTION verify_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only admins can verify users';
    END IF;

    -- Update user verification status
    UPDATE profiles
    SET verification_status = 'verified'
    WHERE id = user_id;
END;
$$;

CREATE OR REPLACE FUNCTION approve_booking(booking_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only admins can approve bookings';
    END IF;

    -- Update booking status
    UPDATE bookings
    SET status = 'confirmed'
    WHERE id = booking_id;
END;
$$;

-- Create admin views for analytics
CREATE OR REPLACE VIEW admin_stats AS
WITH monthly_stats AS (
    SELECT
        COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '1 month' THEN id END) as new_users_last_month,
        COUNT(DISTINCT id) as total_users
    FROM profiles
),
car_stats AS (
    SELECT
        COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '1 month' THEN id END) as new_cars_last_month,
        COUNT(DISTINCT id) as total_cars
    FROM cars
),
booking_stats AS (
    SELECT
        COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '1 month' THEN id END) as new_bookings_last_month,
        COUNT(DISTINCT id) as total_bookings,
        SUM(CASE WHEN created_at >= NOW() - INTERVAL '1 month' THEN total_price END) as revenue_last_month,
        SUM(total_price) as total_revenue
    FROM bookings
)
SELECT
    m.total_users,
    m.new_users_last_month,
    c.total_cars,
    c.new_cars_last_month,
    b.total_bookings,
    b.new_bookings_last_month,
    b.total_revenue,
    b.revenue_last_month
FROM monthly_stats m
CROSS JOIN car_stats c
CROSS JOIN booking_stats b;

-- Grant access to admin views
CREATE POLICY "Admin users can view stats"
    ON admin_stats FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));
