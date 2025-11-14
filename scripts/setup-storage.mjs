import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  console.log('\n💡 Get your service role key from:')
  console.log('   Supabase Dashboard > Settings > API > service_role key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupStorage() {
  console.log('🪣 Setting up Supabase Storage...\n')

  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      throw listError
    }

    const bucketName = 'equipment-images'
    const bucketExists = buckets.some(b => b.name === bucketName)

    if (bucketExists) {
      console.log(`✓ Bucket "${bucketName}" already exists`)
    } else {
      // Create bucket
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      })

      if (error) {
        throw error
      }

      console.log(`✓ Created bucket: ${bucketName}`)
    }

    console.log('\n📋 Bucket Configuration:')
    console.log(`   Name: ${bucketName}`)
    console.log(`   Public: Yes`)
    console.log(`   Max File Size: 5MB`)
    console.log(`   Allowed Types: PNG, JPEG, JPG, WebP`)

    console.log('\n🎉 Storage setup completed!')
    console.log(`\n💡 Public URL format:`)
    console.log(`   ${supabaseUrl}/storage/v1/object/public/${bucketName}/[filename]`)

  } catch (error) {
    console.error('\n❌ Error setting up storage:', error.message)
    process.exit(1)
  }
}

setupStorage()
