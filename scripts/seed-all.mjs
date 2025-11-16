import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

// Simple hash function (in production, use bcrypt)
function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex')
}

const adminData = {
  email: 'admin@vaniasugiarta.com',
  password: hashPassword('admin123456'),
  name: 'Admin User',
  role: 'admin',
  isActive: true
}

const equipmentData = [
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
    pricePerHour: 250000.00,
    imageUrl: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800',
    isAvailable: true
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
    pricePerHour: 300000.00,
    imageUrl: 'https://images.unsplash.com/photo-1625165423461-c04f6dfb1922?w=800',
    isAvailable: true
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
    pricePerHour: 400000.00,
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
    isAvailable: true
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
    pricePerHour: 225000.00,
    imageUrl: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800',
    isAvailable: true
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
    pricePerHour: 75000.00,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    isAvailable: true
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
    pricePerHour: 175000.00,
    imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800',
    isAvailable: true
  }
]

async function main() {
  console.log('🌱 Starting database seeding...\n')

  try {
    // Seed Admin User
    console.log('👤 Creating admin user...')
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: adminData.email }
    })

    if (existingAdmin) {
      console.log(`   ✓ Admin already exists: ${adminData.email}`)
    } else {
      const admin = await prisma.adminUser.create({
        data: adminData
      })
      console.log(`   ✓ Admin created: ${admin.email}`)
    }

    console.log('\n📋 Admin Credentials:')
    console.log(`   Email: ${adminData.email}`)
    console.log(`   Password: admin123456`)
    console.log('   ⚠️  Change password after first login!\n')

    // Seed Equipment
    console.log('🚜 Seeding equipment data...')

    const existingCount = await prisma.heavyEquipment.count()

    if (existingCount > 0) {
      console.log(`   ⚠️  Database already has ${existingCount} equipment(s)`)
      console.log('   Skipping equipment seeding to avoid duplicates\n')
    } else {
      for (const equipment of equipmentData) {
        const created = await prisma.heavyEquipment.create({
          data: equipment
        })
        console.log(`   ✓ Added: ${created.name}`)
      }
      console.log(`\n   ✓ Successfully added ${equipmentData.length} equipment items\n`)
    }

    console.log('🎉 Database seeding completed!')
    console.log('   Visit http://localhost:3000 to see the equipment')
    console.log('   Visit http://localhost:3000/admin/login to access admin dashboard\n')

  } catch (error) {
    console.error('\n❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
