const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAdminUser() {
  try {
    console.log('🔍 Checking for admin user...')
    
    // Check if admin user exists in database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@ecommerce.com')
      .single()

    if (userError && userError.code !== 'PGRST116') {
      console.error('❌ Database error:', userError.message)
      return
    }

    if (userData) {
      console.log('✅ Admin user found!')
      console.log('📧 Email: admin@ecommerce.com')
      console.log('🔑 Password: admin123456')
      console.log('👑 Role:', userData.role)
      console.log('🆔 User ID:', userData.id)
      console.log('')
      console.log('🚀 You can now sign in with these credentials!')
    } else {
      console.log('❌ Admin user not found in database')
      console.log('🔧 Run: node scripts/create-admin.js')
    }

  } catch (error) {
    console.error('❌ Error checking admin user:', error.message)
  }
}

checkAdminUser()

