const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n')

  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'schema.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)

      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })

      if (error && !error.message.includes('already exists')) {
        console.log(`⚠️  Statement ${i + 1}: ${error.message}`)
      } else {
        console.log(`✅ Statement ${i + 1} completed`)
      }
    }

    console.log('\n✨ Database setup completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('1. Go to Supabase Dashboard → Authentication → Users')
    console.log('2. Create an admin user with email & password')
    console.log('3. Run: npm run dev')
    console.log('4. Access admin at: http://localhost:3000/admin/login\n')

  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message)
    console.log('\n💡 Alternative: Run the SQL manually in Supabase Dashboard')
    console.log('   1. Go to https://supabase.com/dashboard')
    console.log('   2. Select your project')
    console.log('   3. Go to SQL Editor')
    console.log('   4. Copy content from supabase/schema.sql')
    console.log('   5. Paste and run it\n')
    process.exit(1)
  }
}

setupDatabase()
