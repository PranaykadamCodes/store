const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const setupStorage = async () => {
  try {
    console.log('🔄 Setting up Supabase Storage...')

    // Create the product-images bucket
    const { data: bucketData, error: bucketError } = await supabase.storage
      .createBucket('product-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      })

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Storage bucket "product-images" already exists')
      } else {
        console.error('❌ Error creating bucket:', bucketError.message)
        return
      }
    } else {
      console.log('✅ Storage bucket "product-images" created successfully')
    }

    // Set up RLS policies for the bucket
    console.log('🔄 Setting up storage policies...')

    // Policy to allow public read access
    const { error: readPolicyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'product-images',
      policy_name: 'Public read access',
      policy_definition: 'true',
      policy_check: 'true',
      policy_roles: 'public'
    })

    if (readPolicyError && !readPolicyError.message.includes('already exists')) {
      console.error('❌ Error creating read policy:', readPolicyError.message)
    } else {
      console.log('✅ Public read policy created')
    }

    // Policy to allow authenticated users to upload
    const { error: uploadPolicyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'product-images',
      policy_name: 'Authenticated upload access',
      policy_definition: 'auth.role() = \'authenticated\'',
      policy_check: 'auth.role() = \'authenticated\'',
      policy_roles: 'authenticated'
    })

    if (uploadPolicyError && !uploadPolicyError.message.includes('already exists')) {
      console.error('❌ Error creating upload policy:', uploadPolicyError.message)
    } else {
      console.log('✅ Authenticated upload policy created')
    }

    console.log('\n🎉 Storage setup complete!')
    console.log('📁 Bucket: product-images')
    console.log('🔓 Public read access enabled')
    console.log('🔐 Authenticated upload access enabled')
    console.log('\n💡 You can now upload product images!')

  } catch (error) {
    console.error('❌ Error setting up storage:', error.message)
  }
}

setupStorage()
