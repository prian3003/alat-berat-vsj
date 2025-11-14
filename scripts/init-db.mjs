import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = 'https://dsvdzihcqupiejnkrktr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdmR6aWhjcXVwaWVqbmtya3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDgyODEsImV4cCI6MjA3ODYyNDI4MX0.0IDTXHa0yQgjPDhIk37Kjyx_rsYne_IZyO1zn8bXDdo'

const supabase = createClient(supabaseUrl, supabaseKey)

async function initDatabase() {
  console.log('🚀 Initializing database...\n')

  try {
    // Test connection
    const { data, error: testError } = await supabase.from('heavy_equipment').select('count').limit(1)

    if (testError && testError.code === '42P01') {
      console.log('📋 Tables do not exist. Please run the SQL manually:')
      console.log('\n1. Go to: https://supabase.com/dashboard/project/dsvdzihcqupiejnkrktr/sql/new')
      console.log('2. Open file: supabase/schema.sql')
      console.log('3. Copy all content and paste it in SQL Editor')
      console.log('4. Click "Run" button\n')

      console.log('📄 SQL file location:', join(__dirname, '..', 'supabase', 'schema.sql'))
      return
    }

    console.log('✅ Database connection successful!')
    console.log('✅ Tables already exist or setup complete!')

    // Check if we have data
    const { count } = await supabase
      .from('heavy_equipment')
      .select('*', { count: 'exact', head: true })

    console.log(`\n📊 Current equipment count: ${count || 0}`)

    if (count === 0) {
      console.log('\n💡 Tip: The sample data from schema.sql should have been inserted.')
      console.log('   If you don\'t see data, please run the SQL file manually.')
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.log('\n📋 Manual setup required:')
    console.log('1. Go to Supabase Dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy content from supabase/schema.sql')
    console.log('4. Paste and execute it')
  }
}

initDatabase()
