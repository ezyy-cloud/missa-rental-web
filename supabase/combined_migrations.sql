-- Add role field to profiles if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Create admin_actions table
CREATE TABLE IF NOT EXISTS admin_actions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type text NOT NULL,
    target_id text NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);

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

-- Insert default settings
INSERT INTO platform_settings (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Update booking status enum
DO $$ BEGIN
    ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
    ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
        CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));
EXCEPTION
    WHEN undefined_table THEN
        -- Handle case where bookings table doesn't exist yet
        NULL;
END $$;

-- Create admin functions
CREATE OR REPLACE FUNCTION promote_to_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE profiles
    SET role = 'admin'
    WHERE email = user_email;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
END;
$$;

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
    SET status = 'available'
    WHERE id = car_id;
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

-- Set up RLS policies
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Admin actions policies
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

-- Platform settings policies
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
