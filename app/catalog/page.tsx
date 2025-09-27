import { supabase } from '@/lib/supabase'
import { Product, Category } from '@/types'
import { Navigation } from '@/components/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, Eye, ShoppingCart, Star, Package } from 'lucide-react'
import { CatalogFilters } from '@/components/catalog-filters'
import { SortSelector } from '@/components/sort-selector'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { WishlistButton } from '@/components/wishlist-button'

interface SearchParams {
  search?: string
  category?: string | string[]
  minPrice?: string
  maxPrice?: string
  sortBy?: string
}

interface CatalogPageProps {
  searchParams: SearchParams
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  // Parse search parameters
  const searchTerm = searchParams.search || ''
  const selectedCategories = Array.isArray(searchParams.category) 
    ? searchParams.category 
    : searchParams.category 
      ? [searchParams.category] 
      : []
  const minPrice = Number(searchParams.minPrice) || 0
  const maxPrice = Number(searchParams.maxPrice) || 1000
  const sortBy = searchParams.sortBy || 'created_at_desc'

  // Build the query
  let query = supabase.from('products').select('*, categories(name, slug)').eq('is_active', true)

  // Apply search term
  if (searchTerm) {
    query = query.ilike('name', `%${searchTerm}%`)
  }

  // Apply price range
  query = query.gte('price', minPrice).lte('price', maxPrice)

  // Apply sorting
  const parts = sortBy.split('_')
  const order = parts[parts.length - 1]
  const field = parts.slice(0, -1).join('_')
  const dbField = field === 'createdAt' ? 'created_at' : field
  query = query.order(dbField, { ascending: order === 'asc' })

  // Fetch products
  const { data: products, error: productsError } = await query

  // Fetch categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (productsError) {
    console.error('Error fetching products:', productsError)
  }

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError)
  }

  // Filter products by category if needed
  let filteredProducts = products || []
  if (selectedCategories.length > 0) {
    filteredProducts = (products || []).filter((product) => {
      const category = product.category as { slug: string }
      return category && selectedCategories.includes(category.slug)
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li className="text-foreground">All Products</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="md:col-span-1 bg-card p-6 rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Filters</h2>
            
            <CatalogFilters 
              categories={categories || []}
              searchTerm={searchTerm}
              selectedCategories={selectedCategories}
              priceRange={[minPrice, maxPrice]}
              sortBy={sortBy}
            />
          </aside>

          {/* Product Listing */}
          <main className="md:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-foreground">All Products ({filteredProducts.length})</h1>
              <div className="flex items-center space-x-4">
                {/* Sort By */}
                <SortSelector sortBy={sortBy} />
              </div>
            </div>

            {!filteredProducts || filteredProducts.length === 0 ? (
              <p className="text-center text-muted-foreground">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination (Placeholder) */}
            <div className="flex justify-center mt-8 space-x-2">
              <Button variant="outline" disabled className="rounded-full px-4 py-2">Previous</Button>
              <Button className="mx-2 rounded-full px-4 py-2">1</Button>
              <Button variant="outline" className="rounded-full px-4 py-2">2</Button>
              <Button variant="outline" className="rounded-full px-4 py-2">3</Button>
              <Button variant="outline" disabled className="rounded-full px-4 py-2">...</Button>
              <Button variant="outline" className="rounded-full px-4 py-2">10</Button>
              <Button variant="outline" className="rounded-full px-4 py-2">Next</Button>
            </div>
          </main>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="bg-primary text-primary-foreground py-16 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-full bg-background border border-border text-foreground placeholder-muted-foreground"
            />
            <Button className="bg-background text-foreground hover:bg-background/90 px-8 py-3 rounded-full font-semibold">
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-foreground">SHOP.CO</h3>
              <p className="text-sm max-w-xs">
                We have products that suits your style and which you're proud to wear. From electronics to fashion.
              </p>
              <div className="flex space-x-3">
                {/* Social Media Icons */}
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">t</Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">f</Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">i</Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">g</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-foreground text-lg">COMPANY</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="/works" className="hover:text-foreground">Works</Link></li>
                <li><Link href="/career" className="hover:text-foreground">Career</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-foreground text-lg">HELP</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/customer-support" className="hover:text-foreground">Customer Support</Link></li>
                <li><Link href="/delivery-details" className="hover:text-foreground">Delivery Details</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-foreground text-lg">FAQ</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/account" className="hover:text-foreground">Account</Link></li>
                <li><Link href="/manage-deliveries" className="hover:text-foreground">Manage Deliveries</Link></li>
                <li><Link href="/orders" className="hover:text-foreground">Orders</Link></li>
                <li><Link href="/payments" className="hover:text-foreground">Payments</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-foreground text-lg">RESOURCES</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/ebooks" className="hover:text-foreground">Free eBooks</Link></li>
                <li><Link href="/tutorials" className="hover:text-foreground">Development Tutorial</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">How to - Blog</Link></li>
                <li><Link href="/youtube" className="hover:text-foreground">Youtube Playlist</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>Shop.co © 2000-2023, All Rights Reserved</p>
            <div className="flex space-x-2 mt-4 md:mt-0">
              {/* Payment Icons */}
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">VISA</div>
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">MC</div>
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">PP</div>
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">AP</div>
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">GP</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group relative overflow-hidden smooth-hover">
      <Link href={`/catalog/${product.slug}`}>
        <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {(product.image_url || product.imageUrl) ? (
            <Image
              src={product.image_url || product.imageUrl || ''}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Package className="h-12 w-12 text-muted-foreground" />
          )}
          <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <WishlistButton 
              product={product} 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
              onClick={(e) => {
                e.preventDefault()
                window.open(`/catalog/${product.slug}`, '_blank')
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <Link href={`/catalog/${product.slug}`}>
          <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, j) => (
            <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-sm text-muted-foreground">({product.reviews_count || 0})</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</span>
          {product.original_price && (
            <span className="text-sm text-muted-foreground line-through">${product.original_price.toFixed(2)}</span>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground py-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-full group-hover:translate-y-0">
        <AddToCartButton 
          product={product} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none"
        />
      </div>
    </Card>
  )
}
