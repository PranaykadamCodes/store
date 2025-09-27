const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const seedCategories = async () => {
  try {
    console.log('🔄 Seeding sample categories...')

    const sampleCategories = [
      { name: 'Electronics', description: 'Electronic devices and gadgets', slug: 'electronics' },
      { name: 'Clothing', description: 'Fashion and apparel', slug: 'clothing' },
      { name: 'Home & Garden', description: 'Home improvement and garden supplies', slug: 'home-garden' },
      { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear', slug: 'sports-outdoors' },
      { name: 'Books', description: 'Books and educational materials', slug: 'books' },
      { name: 'Beauty & Health', description: 'Beauty products and health supplements', slug: 'beauty-health' },
      { name: 'Toys & Games', description: 'Toys, games, and entertainment', slug: 'toys-games' },
      { name: 'Automotive', description: 'Car parts and automotive accessories', slug: 'automotive' }
    ]

    // Check if categories already exist
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('name')

    const existingNames = existingCategories?.map(c => c.name) || []

    const categoriesToInsert = sampleCategories.filter(
      cat => !existingNames.includes(cat.name)
    )

    if (categoriesToInsert.length === 0) {
      console.log('✅ All sample categories already exist')
      return
    }

    const { data, error } = await supabase
      .from('categories')
      .insert(categoriesToInsert)
      .select()

    if (error) {
      console.error('❌ Error seeding categories:', error.message)
      return
    }

    console.log(`✅ Successfully created ${data.length} sample categories:`)
    data.forEach(category => {
      console.log(`   - ${category.name}`)
    })

  } catch (error) {
    console.error('❌ Error seeding categories:', error.message)
  }
}

const seedSampleProducts = async () => {
  try {
    console.log('\n🔄 Seeding sample products...')

    // Get categories first
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name')

    if (!categories || categories.length === 0) {
      console.log('❌ No categories found. Please seed categories first.')
      return
    }

    const electronicsCategory = categories.find(c => c.name === 'Electronics')
    const clothingCategory = categories.find(c => c.name === 'Clothing')
    const booksCategory = categories.find(c => c.name === 'Books')

    const sampleProducts = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
        price: 99.99,
        stock: 50,
        category_id: electronicsCategory?.id,
        slug: 'wireless-bluetooth-headphones',
        is_active: true
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt available in multiple colors and sizes.',
        price: 19.99,
        stock: 100,
        category_id: clothingCategory?.id,
        slug: 'cotton-t-shirt',
        is_active: true
      },
      {
        name: 'Programming Book: JavaScript Guide',
        description: 'Comprehensive guide to modern JavaScript development with practical examples.',
        price: 49.99,
        stock: 25,
        category_id: booksCategory?.id,
        slug: 'programming-book-javascript-guide',
        is_active: true
      },
      {
        name: 'Smartphone Case',
        description: 'Protective case for smartphones with shock absorption and wireless charging support.',
        price: 24.99,
        stock: 75,
        category_id: electronicsCategory?.id,
        slug: 'smartphone-case',
        is_active: true
      },
      {
        name: 'Denim Jeans',
        description: 'Classic blue denim jeans with comfortable fit and durable construction.',
        price: 59.99,
        stock: 40,
        category_id: clothingCategory?.id,
        slug: 'denim-jeans',
        is_active: true
      }
    ]

    // Check if products already exist
    const { data: existingProducts } = await supabase
      .from('products')
      .select('name')

    const existingNames = existingProducts?.map(p => p.name) || []

    const productsToInsert = sampleProducts.filter(
      product => !existingNames.includes(product.name)
    )

    if (productsToInsert.length === 0) {
      console.log('✅ All sample products already exist')
      return
    }

    const { data, error } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select()

    if (error) {
      console.error('❌ Error seeding products:', error.message)
      return
    }

    console.log(`✅ Successfully created ${data.length} sample products:`)
    data.forEach(product => {
      console.log(`   - ${product.name} ($${product.price})`)
    })

  } catch (error) {
    console.error('❌ Error seeding products:', error.message)
  }
}

const main = async () => {
  console.log('🌱 Starting database seeding...\n')
  
  await seedCategories()
  await seedSampleProducts()
  
  console.log('\n🎉 Database seeding complete!')
  console.log('\n💡 You can now:')
  console.log('   1. Visit /admin to access the admin dashboard')
  console.log('   2. Sign in with admin@ecommerce.com / admin123456')
  console.log('   3. Manage products and categories')
}

main()
