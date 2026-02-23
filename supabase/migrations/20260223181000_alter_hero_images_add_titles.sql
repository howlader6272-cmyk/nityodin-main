ALTER TABLE public.hero_images
  ADD COLUMN IF NOT EXISTS title_bn TEXT,
  ADD COLUMN IF NOT EXISTS subtitle_bn TEXT;

