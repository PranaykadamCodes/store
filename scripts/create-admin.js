const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...')
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@ecommerce.com',
      password: 'admin123456',
      email_confirm: true,
      user_metadata: {
        name: 'Admin User',
        role: 'admin'
      }
    })

    if (authError) {
      console.error('❌ Auth error:', authError.message)
      return
    }

    console.log('✅ Auth user created:', authData.user.email)

    // Create user record in our database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'admin@ecommerce.com',
        name: 'Admin User',
        password_hash: '', // OAuth users don't have password hashes
        role: 'admin'
      })
      .select()

    if (userError) {
      console.error('❌ Database error:', userError.message)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@ecommerce.com')
    console.log('🔑 Password: admin123456')
    console.log('👑 Role: admin')
    console.log('')
    console.log('🚀 You can now sign in with these credentials!')

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
  }
}

createAdminUser()
