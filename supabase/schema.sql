-- Create heavy_equipment table
CREATE TABLE IF NOT EXISTS public.heavy_equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  specifications JSONB,
  price_per_day DECIMAL(10, 2),
  price_per_month DECIMAL(10, 2),
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create equipment_images table for multiple images per equipment
CREATE TABLE IF NOT EXISTS public.equipment_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL REFERENCES public.heavy_equipment(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_category ON public.heavy_equipment(category);
CREATE INDEX IF NOT EXISTS idx_heavy_equipment_is_available ON public.heavy_equipment(is_available);
CREATE INDEX IF NOT EXISTS idx_equipment_images_equipment_id ON public.equipment_images(equipment_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_heavy_equipment_updated_at
  BEFORE UPDATE ON public.heavy_equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.heavy_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to heavy_equipment"
  ON public.heavy_equipment
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to equipment_images"
  ON public.equipment_images
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users (admin) to manage equipment
CREATE POLICY "Allow authenticated users to insert equipment"
  ON public.heavy_equipment
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update equipment"
  ON public.heavy_equipment
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete equipment"
  ON public.heavy_equipment
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for equipment_images
CREATE POLICY "Allow authenticated users to insert equipment_images"
  ON public.equipment_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update equipment_images"
  ON public.equipment_images
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete equipment_images"
  ON public.equipment_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert some sample data
INSERT INTO public.heavy_equipment (name, category, description, specifications, price_per_day, price_per_month, image_url, is_available)
VALUES
  (
    'Excavator Komatsu PC200',
    'excavator',
    'Excavator kelas menengah dengan performa tinggi dan efisiensi bahan bakar yang sangat baik. Cocok untuk berbagai proyek konstruksi.',
    '{"brand": "Komatsu", "model": "PC200", "capacity": "20 ton", "engine_power": "123 kW", "bucket_capacity": "0.8 m³"}'::jsonb,
    5000000,
    120000000,
    '/images/excavator-1.jpg',
    true
  ),
  (
    'Bulldozer Caterpillar D6T',
    'bulldozer',
    'Bulldozer dengan teknologi terkini untuk efisiensi maksimal dalam pekerjaan tanah.',
    '{"brand": "Caterpillar", "model": "D6T", "operating_weight": "18.5 ton", "engine_power": "168 kW", "blade_capacity": "3.4 m³"}'::jsonb,
    6500000,
    150000000,
    '/images/bulldozer-1.jpg',
    true
  ),
  (
    'Crane Liebherr LTM 1040',
    'crane',
    'Mobile crane dengan kapasitas angkat 40 ton, ideal untuk proyek konstruksi gedung tinggi.',
    '{"brand": "Liebherr", "model": "LTM 1040", "max_capacity": "40 ton", "max_height": "40 m", "boom_length": "35 m"}'::jsonb,
    8000000,
    200000000,
    '/images/crane-1.jpg',
    true
  ),
  (
    'Wheel Loader Volvo L90H',
    'loader',
    'Wheel loader dengan daya muat besar dan kenyamanan operator yang tinggi.',
    '{"brand": "Volvo", "model": "L90H", "operating_weight": "13.5 ton", "engine_power": "157 kW", "bucket_capacity": "2.6 m³"}'::jsonb,
    4500000,
    110000000,
    '/images/loader-1.jpg',
    true
  );
