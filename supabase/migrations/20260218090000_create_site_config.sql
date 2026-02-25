-- Create site_config table for dynamic site settings
CREATE TABLE public.site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url TEXT,
  favicon_url TEXT,
  site_title TEXT,
  site_description TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  meta_pixel_id TEXT,
  google_analytics_id TEXT,
  custom_scripts TEXT,
  phone_number TEXT,
  whatsapp_number TEXT,
  facebook_link TEXT,
  announcement_text TEXT,
  countdown_end TIMESTAMPTZ
);

-- Create storage bucket for site assets
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

-- Allow public read access
CREATE POLICY "Site assets are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets');

-- Allow admins to upload images
CREATE POLICY "Admins can upload site assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND has_role(auth.uid(), 'admin'));

-- Allow admins to update images
CREATE POLICY "Admins can update site assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'site-assets' AND has_role(auth.uid(), 'admin'));

-- Allow admins to delete images
CREATE POLICY "Admins can delete site assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'site-assets' AND has_role(auth.uid(), 'admin'));
