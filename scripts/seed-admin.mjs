import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Default admin credentials
const ADMIN_EMAIL = 'admin@alatberat.com'
const ADMIN_PASSWORD = 'admin123456'

async function createAdminUser() {
  console.log('👤 Creating admin user...\n')

  try {
    // Check if admin already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.log('⚠️  Cannot check existing users. Will attempt to create anyway.')
    } else {
      const adminExists = existingUsers?.users?.some(user => user.email === ADMIN_EMAIL)

      if (adminExists) {
        console.log(`✅ Admin user already exists: ${ADMIN_EMAIL}`)
        console.log('   You can use these credentials to login:\n')
        console.log(`   Email: ${ADMIN_EMAIL}`)
        console.log(`   Password: ${ADMIN_PASSWORD}`)
        console.log('\n💡 Visit http://localhost:3000/admin/login to access the dashboard\n')
        return
      }
    }

    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Admin User'
      }
    })

    if (error) {
      throw error
    }

    console.log('✅ Admin user created successfully!')
    console.log('\n📋 Admin Credentials:')
    console.log(`   Email: ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    console.log('\n⚠️  IMPORTANT: Please change this password after first login!')
    console.log('\n💡 Visit http://localhost:3000/admin/login to access the dashboard\n')

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message)

    if (error.message?.includes('already registered')) {
      console.log('\n✅ Admin user already exists!')
      console.log(`   Email: ${ADMIN_EMAIL}`)
      console.log(`   Password: ${ADMIN_PASSWORD}`)
    } else if (error.message?.includes('service_role')) {
      console.error('\n⚠️  You need the SUPABASE_SERVICE_ROLE_KEY to create users.')
      console.error('   Get it from: Supabase Dashboard > Settings > API > service_role key')
      console.error('   Add it to your .env file as SUPABASE_SERVICE_ROLE_KEY')

      console.log('\n📋 Alternative: Create user manually in Supabase Dashboard:')
      console.log('   1. Go to: https://supabase.com/dashboard')
      console.log('   2. Navigate to: Authentication > Users')
      console.log('   3. Click "Add user" > "Create new user"')
      console.log(`   4. Email: ${ADMIN_EMAIL}`)
      console.log(`   5. Password: ${ADMIN_PASSWORD}`)
      console.log('   6. Enable "Auto Confirm User"')
    }

    process.exit(1)
  }
}

createAdminUser()
