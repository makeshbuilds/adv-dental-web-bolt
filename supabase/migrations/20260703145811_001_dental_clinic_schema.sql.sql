/*
# Dental Clinic CMS Schema Migration

Converts MySQL/Drizzle schema to PostgreSQL for Supabase.

1. New Tables (17 total)
   - users: Admin users with role-based access (links to auth.users via user_id)
   - clinic_settings: Global clinic configuration
   - seo_settings: Per-page SEO metadata
   - home_page_content: Home page sections and media
   - about_page_content: About page content
   - services: Service listings
   - services_page_content: Services page header
   - gallery_items: Gallery images
   - gallery_page_content: Gallery page header
   - faq_items: FAQ questions/answers
   - faq_page_content: FAQ page header
   - why_choose_us_page_content: Why Choose Us page content
   - why_choose_us_features: Feature cards for Why Choose Us
   - booking_page_content: Booking page header
   - booking_form_fields: Dynamic form field definitions
   - booking_submissions: Submitted booking forms

2. Security
   - RLS enabled on all tables
   - Public read access (anon + authenticated) for content tables
   - Write access restricted to authenticated admin users only
   - Admin role checked via users.role = 'admin'

3. Notes
   - Uses serial (integer) IDs to match existing TypeScript types
   - JSONB for flexible JSON storage
   - Text check constraints for enum-like fields
*/

-- Users table (links to Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  open_id varchar(64) NOT NULL UNIQUE,
  name text,
  email varchar(320),
  login_method varchar(64),
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_signed_in timestamptz NOT NULL DEFAULT now()
);

-- Clinic settings
CREATE TABLE IF NOT EXISTS clinic_settings (
  id serial PRIMARY KEY,
  clinic_name varchar(255) NOT NULL,
  doctor_name varchar(255) NOT NULL,
  doctor_qualification text,
  doctor_experience varchar(100),
  address text,
  phone varchar(20),
  email varchar(320),
  whatsapp varchar(20),
  instagram varchar(255),
  facebook varchar(255),
  google_business varchar(255),
  youtube varchar(255),
  linkedin varchar(255),
  booking_notification_email varchar(320) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- SEO settings
CREATE TABLE IF NOT EXISTS seo_settings (
  id serial PRIMARY KEY,
  page_slug varchar(100) NOT NULL UNIQUE,
  page_title varchar(255) NOT NULL,
  meta_description varchar(320),
  meta_keywords varchar(500),
  og_title varchar(255),
  og_description varchar(320),
  og_image varchar(500),
  twitter_title varchar(255),
  twitter_description varchar(320),
  twitter_image varchar(500),
  canonical_url varchar(500),
  schema_markup text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Home page content
CREATE TABLE IF NOT EXISTS home_page_content (
  id serial PRIMARY KEY,
  badge varchar(255),
  heading varchar(255),
  background_image_url varchar(500),
  background_video_url varchar(500),
  background_media_type text DEFAULT 'image' CHECK (background_media_type IN ('image', 'video')),
  h2_sections jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- About page content
CREATE TABLE IF NOT EXISTS about_page_content (
  id serial PRIMARY KEY,
  badge varchar(255),
  heading varchar(255),
  description text,
  doctor_image_url varchar(500),
  background_image_url varchar(500),
  background_video_url varchar(500),
  background_media_type text DEFAULT 'image' CHECK (background_media_type IN ('image', 'video')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id serial PRIMARY KEY,
  title varchar(255) NOT NULL,
  slug varchar(255) NOT NULL UNIQUE,
  short_description varchar(500),
  detailed_description text,
  image_url varchar(500),
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Services page content
CREATE TABLE IF NOT EXISTS services_page_content (
  id serial PRIMARY KEY,
  badge varchar(255),
  heading varchar(255),
  background_image_url varchar(500),
  background_video_url varchar(500),
  background_media_type text DEFAULT 'image' CHECK (background_media_type IN ('image', 'video')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Gallery items
CREATE TABLE IF NOT EXISTS gallery_items (
  id serial PRIMARY KEY,
  heading varchar(255) NOT NULL,
  description text,
  image_url varchar(500) NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Gallery page content
CREATE TABLE IF NOT EXISTS gallery_page_content (
  id serial PRIMARY KEY,
  badge varchar(255),
  heading varchar(255),
  background_image_url varchar(500),
  background_video_url varchar(500),
  background_media_type text DEFAULT 'image' CHECK (background_media_type IN ('image', 'video')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- FAQ items
CREATE TABLE IF NOT EXISTS faq_items (
  id serial PRIMARY KEY,
  question varchar(500) NOT NULL,
  answer text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- FAQ page content
CREATE TABLE IF NOT EXISTS faq_page_content (
  id serial PRIMARY KEY,
  badge varchar(255),
  heading varchar(255),
  background_image_url varchar(500),
  background_video_url varchar(500),
  background_media_type text DEFAULT 'image' CHECK (background_media_type IN ('image', 'video')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Why Choose Us page content
CREATE TABLE IF NOT EXISTS why_choose_us_page_content (
  id serial PRIMARY KEY,
  badge varchar(255),
  heading varchar(255),
  description text,
  feature_image_url varchar(500),
  background_image_url varchar(500),
  background_video_url varchar(500),
  background_media_type text DEFAULT 'image' CHECK (background_media_type IN ('image', 'video')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Why Choose Us features
CREATE TABLE IF NOT EXISTS why_choose_us_features (
  id serial PRIMARY KEY,
  heading varchar(255) NOT NULL,
  description text,
  icon varchar(100),
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Booking page content
CREATE TABLE IF NOT EXISTS booking_page_content (
  id serial PRIMARY KEY,
  welcome_message text,
  background_image_url varchar(500),
  background_video_url varchar(500),
  background_media_type text DEFAULT 'image' CHECK (background_media_type IN ('image', 'video')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Booking form fields
CREATE TABLE IF NOT EXISTS booking_form_fields (
  id serial PRIMARY KEY,
  field_name varchar(255) NOT NULL,
  field_type text NOT NULL CHECK (field_type IN ('text', 'number', 'email', 'date', 'textarea', 'dropdown', 'radio', 'checkbox')),
  label varchar(255) NOT NULL,
  placeholder varchar(255),
  is_required boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  options jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Booking submissions
CREATE TABLE IF NOT EXISTS booking_submissions (
  id serial PRIMARY KEY,
  form_data jsonb NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  email_sent boolean DEFAULT false,
  email_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_choose_us_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_choose_us_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_submissions ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Users: only admins can read/write users table
DROP POLICY IF EXISTS "admin_select_users" ON users;
CREATE POLICY "admin_select_users" ON users FOR SELECT
  TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_insert_users" ON users;
CREATE POLICY "admin_insert_users" ON users FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_users" ON users;
CREATE POLICY "admin_update_users" ON users FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_users" ON users;
CREATE POLICY "admin_delete_users" ON users FOR DELETE
  TO authenticated USING (is_admin());

-- Content tables: public read, admin write
-- clinic_settings
DROP POLICY IF EXISTS "public_read_clinic_settings" ON clinic_settings;
CREATE POLICY "public_read_clinic_settings" ON clinic_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_clinic_settings" ON clinic_settings;
CREATE POLICY "admin_write_clinic_settings" ON clinic_settings FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- seo_settings
DROP POLICY IF EXISTS "public_read_seo_settings" ON seo_settings;
CREATE POLICY "public_read_seo_settings" ON seo_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_seo_settings" ON seo_settings;
CREATE POLICY "admin_write_seo_settings" ON seo_settings FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- home_page_content
DROP POLICY IF EXISTS "public_read_home_page_content" ON home_page_content;
CREATE POLICY "public_read_home_page_content" ON home_page_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_home_page_content" ON home_page_content;
CREATE POLICY "admin_write_home_page_content" ON home_page_content FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- about_page_content
DROP POLICY IF EXISTS "public_read_about_page_content" ON about_page_content;
CREATE POLICY "public_read_about_page_content" ON about_page_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_about_page_content" ON about_page_content;
CREATE POLICY "admin_write_about_page_content" ON about_page_content FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- services
DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_services" ON services;
CREATE POLICY "admin_write_services" ON services FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- services_page_content
DROP POLICY IF EXISTS "public_read_services_page_content" ON services_page_content;
CREATE POLICY "public_read_services_page_content" ON services_page_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_services_page_content" ON services_page_content;
CREATE POLICY "admin_write_services_page_content" ON services_page_content FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- gallery_items
DROP POLICY IF EXISTS "public_read_gallery_items" ON gallery_items;
CREATE POLICY "public_read_gallery_items" ON gallery_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_gallery_items" ON gallery_items;
CREATE POLICY "admin_write_gallery_items" ON gallery_items FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- gallery_page_content
DROP POLICY IF EXISTS "public_read_gallery_page_content" ON gallery_page_content;
CREATE POLICY "public_read_gallery_page_content" ON gallery_page_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_gallery_page_content" ON gallery_page_content;
CREATE POLICY "admin_write_gallery_page_content" ON gallery_page_content FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- faq_items
DROP POLICY IF EXISTS "public_read_faq_items" ON faq_items;
CREATE POLICY "public_read_faq_items" ON faq_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_faq_items" ON faq_items;
CREATE POLICY "admin_write_faq_items" ON faq_items FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- faq_page_content
DROP POLICY IF EXISTS "public_read_faq_page_content" ON faq_page_content;
CREATE POLICY "public_read_faq_page_content" ON faq_page_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_faq_page_content" ON faq_page_content;
CREATE POLICY "admin_write_faq_page_content" ON faq_page_content FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- why_choose_us_page_content
DROP POLICY IF EXISTS "public_read_why_choose_us_page_content" ON why_choose_us_page_content;
CREATE POLICY "public_read_why_choose_us_page_content" ON why_choose_us_page_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_why_choose_us_page_content" ON why_choose_us_page_content;
CREATE POLICY "admin_write_why_choose_us_page_content" ON why_choose_us_page_content FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- why_choose_us_features
DROP POLICY IF EXISTS "public_read_why_choose_us_features" ON why_choose_us_features;
CREATE POLICY "public_read_why_choose_us_features" ON why_choose_us_features FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_why_choose_us_features" ON why_choose_us_features;
CREATE POLICY "admin_write_why_choose_us_features" ON why_choose_us_features FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- booking_page_content
DROP POLICY IF EXISTS "public_read_booking_page_content" ON booking_page_content;
CREATE POLICY "public_read_booking_page_content" ON booking_page_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_booking_page_content" ON booking_page_content;
CREATE POLICY "admin_write_booking_page_content" ON booking_page_content FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- booking_form_fields
DROP POLICY IF EXISTS "public_read_booking_form_fields" ON booking_form_fields;
CREATE POLICY "public_read_booking_form_fields" ON booking_form_fields FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_booking_form_fields" ON booking_form_fields;
CREATE POLICY "admin_write_booking_form_fields" ON booking_form_fields FOR ALL
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- booking_submissions: public can insert, admin can read/delete
DROP POLICY IF EXISTS "public_insert_booking_submissions" ON booking_submissions;
CREATE POLICY "public_insert_booking_submissions" ON booking_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_booking_submissions" ON booking_submissions;
CREATE POLICY "admin_read_booking_submissions" ON booking_submissions FOR SELECT
  TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_delete_booking_submissions" ON booking_submissions;
CREATE POLICY "admin_delete_booking_submissions" ON booking_submissions FOR DELETE
  TO authenticated USING (is_admin());

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_seo_settings_page_slug ON seo_settings(page_slug);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_submissions_submitted_at ON booking_submissions(submitted_at DESC);