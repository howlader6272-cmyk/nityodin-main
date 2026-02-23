-- Backfill hero_images table from existing site_config.hero_image_url
-- This will take the current hero image URL (if it points to the site-assets
-- storage bucket) and insert a corresponding row into public.hero_images so
-- that the new Hero Images Gallery and homepage slider can use it.

INSERT INTO public.hero_images (image_path, is_active)
SELECT DISTINCT
  regexp_replace(
    hero_image_url,
    '^.+/storage/v1/object/public/site-assets/',
    ''
  ) AS image_path,
  true AS is_active
FROM public.site_config
WHERE hero_image_url IS NOT NULL
  AND hero_image_url <> ''
  AND hero_image_url LIKE '%/storage/v1/object/public/site-assets/%'
  AND NOT EXISTS (
    SELECT 1
    FROM public.hero_images hi
    WHERE hi.image_path = regexp_replace(
      hero_image_url,
      '^.+/storage/v1/object/public/site-assets/',
      ''
    )
  );

