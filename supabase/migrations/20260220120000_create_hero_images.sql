-- Create hero_images table for managing hero section images
CREATE TABLE public.hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_path TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create storage bucket for hero images
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-assets', 'hero-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to hero images
CREATE POLICY "Hero assets are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hero-assets');

-- Allow admins to upload hero images
CREATE POLICY "Admins can upload hero assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'hero-assets' AND has_role(auth.uid(), 'admin'));

-- Allow admins to update hero images
CREATE POLICY "Admins can update hero assets"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'hero-assets' AND has_role(auth.uid(), 'admin'));

-- Allow admins to delete hero images
CREATE POLICY "Admins can delete hero assets"
ON storage.objects
FOR DELETE
USING (bucket_id = 'hero-assets' AND has_role(auth.uid(), 'admin'));

