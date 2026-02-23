-- Add focus and zoom support to banners for hero section
-- This lets admin move hero banner image horizontally/vertically and zoom

ALTER TABLE public.banners
  ADD COLUMN IF NOT EXISTS focus_x NUMERIC(5,2) DEFAULT 50,
  ADD COLUMN IF NOT EXISTS focus_y NUMERIC(5,2) DEFAULT 50,
  ADD COLUMN IF NOT EXISTS zoom NUMERIC(5,2) DEFAULT 1.0;


