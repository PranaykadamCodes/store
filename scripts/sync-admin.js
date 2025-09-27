const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function syncAdminUser() {
  try {
    console.log('🔍 Looking for existing admin user in Supabase Auth...')
    
    // Get all users from Supabase Auth
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message)
      return
    }

    // Find admin user
    const adminUser = users.users.find(user => user.email === 'admin@ecommerce.com')
    
    if (!adminUser) {
      console.log('❌ Admin user not found in Supabase Auth')
      console.log('🔧 Run: node scripts/create-admin.js')
      return
    }

    console.log('✅ Found admin user in Supabase Auth:', adminUser.email)

    // Check if user exists in our database
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', adminUser.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Database error:', checkError.message)
      return
    }

    if (existingUser) {
      console.log('✅ Admin user already exists in database!')
      console.log('📧 Email: admin@ecommerce.com')
      console.log('🔑 Password: admin123456')
      console.log('👑 Role:', existingUser.role)
      console.log('🆔 User ID:', existingUser.id)
    } else {
      // Add user to our database
      console.log('🔄 Adding admin user to database...')
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: adminUser.id,
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

      console.log('✅ Admin user added to database!')
      console.log('📧 Email: admin@ecommerce.com')
      console.log('🔑 Password: admin123456')
      console.log('👑 Role: admin')
      console.log('🆔 User ID:', adminUser.id)
    }

    console.log('')
    console.log('🚀 You can now sign in with these credentials!')

  } catch (error) {
    console.error('❌ Error syncing admin user:', error.message)
  }
}

syncAdminUser()

