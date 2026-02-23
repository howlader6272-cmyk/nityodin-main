-- Add focus/crop position columns to hero_images
-- These store the focal point (percentage) for horizontal and vertical alignment

ALTER TABLE public.hero_images
  ADD COLUMN IF NOT EXISTS focus_x NUMERIC(5,2) DEFAULT 50,
  ADD COLUMN IF NOT EXISTS focus_y NUMERIC(5,2) DEFAULT 50;

