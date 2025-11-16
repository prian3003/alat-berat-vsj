-- Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category);

-- Create index on published status
CREATE INDEX IF NOT EXISTS idx_gallery_published ON public.gallery(published, sort_order);

-- Create index on sort_order for ordering
CREATE INDEX IF NOT EXISTS idx_gallery_sort_order ON public.gallery(sort_order);

-- Enable Row Level Security
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read published gallery images
CREATE POLICY "Public can read published gallery images"
  ON public.gallery
  FOR SELECT
  USING (published = true);

-- Policy: Authenticated users can read all gallery images (for admin)
CREATE POLICY "Authenticated users can read all gallery images"
  ON public.gallery
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert gallery images
CREATE POLICY "Authenticated users can insert gallery images"
  ON public.gallery
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update gallery images
CREATE POLICY "Authenticated users can update gallery images"
  ON public.gallery
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete gallery images
CREATE POLICY "Authenticated users can delete gallery images"
  ON public.gallery
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER trigger_update_gallery_updated_at
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_updated_at();
