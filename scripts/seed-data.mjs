import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dsvdzihcqupiejnkrktr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdmR6aWhjcXVwaWVqbmtya3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDgyODEsImV4cCI6MjA3ODYyNDI4MX0.0IDTXHa0yQgjPDhIk37Kjyx_rsYne_IZyO1zn8bXDdo'

const supabase = createClient(supabaseUrl, supabaseKey)

const sampleData = [
  {
    name: 'Excavator Komatsu PC200',
    category: 'excavator',
    description: 'Excavator kelas menengah dengan performa tinggi dan efisiensi bahan bakar yang sangat baik. Cocok untuk berbagai proyek konstruksi.',
    specifications: {
      brand: 'Komatsu',
      model: 'PC200',
      capacity: '20 ton',
      engine_power: '123 kW',
      bucket_capacity: '0.8 m³'
    },
    price_per_day: 5000000,
    price_per_month: 120000000,
    image_url: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800',
    is_available: true
  },
  {
    name: 'Bulldozer Caterpillar D6T',
    category: 'bulldozer',
    description: 'Bulldozer dengan teknologi terkini untuk efisiensi maksimal dalam pekerjaan tanah.',
    specifications: {
      brand: 'Caterpillar',
      model: 'D6T',
      operating_weight: '18.5 ton',
      engine_power: '168 kW',
      blade_capacity: '3.4 m³'
    },
    price_per_day: 6500000,
    price_per_month: 150000000,
    image_url: 'https://images.unsplash.com/photo-1625165423461-c04f6dfb1922?w=800',
    is_available: true
  },
  {
    name: 'Crane Liebherr LTM 1040',
    category: 'crane',
    description: 'Mobile crane dengan kapasitas angkat 40 ton, ideal untuk proyek konstruksi gedung tinggi.',
    specifications: {
      brand: 'Liebherr',
      model: 'LTM 1040',
      max_capacity: '40 ton',
      max_height: '40 m',
      boom_length: '35 m'
    },
    price_per_day: 8000000,
    price_per_month: 200000000,
    image_url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
    is_available: true
  },
  {
    name: 'Wheel Loader Volvo L90H',
    category: 'loader',
    description: 'Wheel loader dengan daya muat besar dan kenyamanan operator yang tinggi.',
    specifications: {
      brand: 'Volvo',
      model: 'L90H',
      operating_weight: '13.5 ton',
      engine_power: '157 kW',
      bucket_capacity: '2.6 m³'
    },
    price_per_day: 4500000,
    price_per_month: 110000000,
    image_url: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800',
    is_available: true
  },
  {
    name: 'Forklift Toyota 8FG25',
    category: 'forklift',
    description: 'Forklift serbaguna dengan kapasitas angkat 2.5 ton untuk keperluan gudang dan logistik.',
    specifications: {
      brand: 'Toyota',
      model: '8FG25',
      capacity: '2.5 ton',
      lift_height: '4.5 m',
      fuel_type: 'Diesel'
    },
    price_per_day: 1500000,
    price_per_month: 35000000,
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    is_available: true
  },
  {
    name: 'Dump Truck Hino FM 260',
    category: 'dump_truck',
    description: 'Dump truck tangguh untuk pengangkutan material konstruksi dengan kapasitas besar.',
    specifications: {
      brand: 'Hino',
      model: 'FM 260',
      capacity: '15 ton',
      engine_power: '260 HP',
      dump_body: '6x4'
    },
    price_per_day: 3500000,
    price_per_month: 85000000,
    image_url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800',
    is_available: true
  }
]

async function seedData() {
  console.log('🌱 Seeding database with sample data...\n')

  try {
    // Check current count
    const { count: currentCount } = await supabase
      .from('heavy_equipment')
      .select('*', { count: 'exact', head: true })

    if (currentCount > 0) {
      console.log(`⚠️  Database already has ${currentCount} equipment(s).`)
      console.log('   Do you want to add more sample data anyway? (This will keep existing data)\n')
    }

    // Insert sample data
    const { data, error } = await supabase
      .from('heavy_equipment')
      .insert(sampleData)
      .select()

    if (error) {
      throw error
    }

    console.log(`✅ Successfully added ${data.length} equipment to database!`)
    console.log('\n📋 Sample equipment added:')
    data.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name}`)
    })

    console.log('\n🎉 Database seeding completed!')
    console.log('   Visit http://localhost:3000 to see the equipment')
    console.log('   Visit http://localhost:3000/admin to manage them\n')

  } catch (error) {
    console.error('\n❌ Error seeding data:', error.message)
    process.exit(1)
  }
}

seedData()
