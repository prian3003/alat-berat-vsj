-- Seed gallery table with sample images
INSERT INTO public.gallery (
  title,
  description,
  image_url,
  category,
  sort_order,
  published
) VALUES

-- Excavator Projects
(
  'Excavator 20 Ton - Proyek Galian Fondasi',
  'Excavator 20 ton melakukan galian fondasi untuk gedung perkantoran di Denpasar',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=600&fit=crop',
  'excavator',
  1,
  true
),

(
  'Mini Excavator - Landscape Villa Kuta',
  'Mini excavator 3 ton digunakan untuk landscaping dan drainage di villa mewah Kuta',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=600&fit=crop',
  'excavator',
  2,
  true
),

(
  'Excavator Hydraulic Breaker - Demolition Badung',
  'Excavator dengan hydraulic breaker melakukan demolition bangunan lama di Badung',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=600&fit=crop',
  'demolition',
  3,
  true
),

-- Bulldozer Projects
(
  'Bulldozer - Land Clearing Gianyar',
  'Bulldozer D65 melakukan land clearing untuk proyek resort di Gianyar',
  'https://images.unsplash.com/photo-1581092916581-8022df4466f9?w=600&h=600&fit=crop',
  'bulldozer',
  4,
  true
),

(
  'Bulldozer - Road Construction Tabanan',
  'Bulldozer CAT melakukan leveling dan grading untuk akses jalan proyek di Tabanan',
  'https://images.unsplash.com/photo-1581092916581-8022df4466f9?w=600&h=600&fit=crop',
  'bulldozer',
  5,
  true
),

-- Loader Projects
(
  'Wheel Loader - Material Loading',
  'Wheel loader 5 ton melakukan loading material ke dump truck untuk transportasi',
  'https://images.unsplash.com/photo-1581092161562-40fed08e5d5d?w=600&h=600&fit=crop',
  'loader',
  6,
  true
),

(
  'Skid Steer Loader - Paving Project',
  'Skid steer loader dengan vibratory plate melakukan compaction untuk paving',
  'https://images.unsplash.com/photo-1581092161562-40fed08e5d5d?w=600&h=600&fit=crop',
  'loader',
  7,
  true
);
