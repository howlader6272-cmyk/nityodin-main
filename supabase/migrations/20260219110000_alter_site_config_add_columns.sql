-- Extend site_config with new columns for theme, SEO, popup, and footer
ALTER TABLE public.site_config
  ADD COLUMN IF NOT EXISTS og_image_url TEXT,
  ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
  ADD COLUMN IF NOT EXISTS primary_color TEXT,
  ADD COLUMN IF NOT EXISTS is_dark_mode BOOLEAN,
  ADD COLUMN IF NOT EXISTS custom_head_scripts TEXT,
  ADD COLUMN IF NOT EXISTS popup_enabled BOOLEAN,
  ADD COLUMN IF NOT EXISTS popup_image_url TEXT,
  ADD COLUMN IF NOT EXISTS popup_text TEXT,
  ADD COLUMN IF NOT EXISTS footer_copyright TEXT,
  ADD COLUMN IF NOT EXISTS testimonial_json JSONB;

-- Ensure site-assets bucket exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'site-assets') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);
  END IF;
END $$;

-- Ensure public read policy exists (idempotent guard by name)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'objects'
      AND policyname = 'Site assets are publicly accessible'
  ) THEN
    CREATE POLICY "Site assets are publicly accessible" ON storage.objects
      FOR SELECT USING (bucket_id = 'site-assets');
  END IF;
END $$;

