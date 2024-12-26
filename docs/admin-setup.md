# Admin Dashboard Setup Guide

## Database Setup

1. Access your Supabase project's SQL Editor
2. Run the following SQL commands to set up admin functionality:

```sql
-- Add role field to profiles
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

-- Create admin promotion function
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
```

## Creating Your First Admin

1. Sign up for a regular account on your platform if you haven't already
2. Note the email address you used
3. In Supabase's SQL Editor, run:
```sql
SELECT promote_to_admin('your-email@example.com');
```

## Accessing the Admin Dashboard

1. Sign in to your account
2. Navigate to `/admin` in your browser
3. If you have admin privileges, you'll see the admin dashboard
4. If not, you'll be redirected to the home page

## Available Admin Features

### Dashboard Overview
- Platform statistics
- Recent activities
- Key metrics

### User Management
- View and manage users
- Verify user identities
- Suspend/unsuspend accounts

### Car Management
- Review car listings
- Approve/reject cars
- Monitor car status

### Booking Management
- View all bookings
- Handle booking issues
- Process refunds

### Platform Settings
- Commission rates
- Rental durations
- Platform configuration
- Verification requirements

## Security Notes

1. All admin actions are logged in the `admin_actions` table
2. Role-based access is enforced at both database and application levels
3. Only users with the 'admin' role can:
   - Access the admin dashboard
   - Modify platform settings
   - Approve/reject users and cars

## Creating Additional Admins

To create more admin users:
1. Access Supabase's SQL Editor
2. Run:
```sql
SELECT promote_to_admin('new-admin-email@example.com');
```

## Monitoring Admin Activity

View admin actions in Supabase:
```sql
SELECT 
    aa.created_at,
    p.email as admin_email,
    aa.action_type,
    aa.target_id,
    aa.reason
FROM admin_actions aa
JOIN profiles p ON aa.admin_id = p.id
ORDER BY aa.created_at DESC;
```
