'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Package,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  Share2,
  Loader2,
  Eye,
  ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { Navigation } from '@/components/navigation'
import { WishlistButton } from '@/components/wishlist-button'
import { ReviewForm } from '@/components/review-form'
import { ReviewsList } from '@/components/reviews-list'
import { useCart } from '@/lib/cart-context'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image_url: string | null
  slug: string
  is_active: boolean
  created_at: string
  categories: { name: string } | null
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('olive')
  const [selectedSize, setSelectedSize] = useState('L')
  const [activeTab, setActiveTab] = useState('details')
  const [refreshReviews, setRefreshReviews] = useState(0)
  const { toast } = useToast()
  const { dispatch } = useCart()

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        })
        setProduct(null)
      } else {
        setProduct(data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching product details.",
        variant: "destructive",
      })
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (product) {
      if (type === 'increment' && quantity < product.stock) {
        setQuantity(prev => prev + 1)
      } else if (type === 'decrement' && quantity > 1) {
        setQuantity(prev => prev - 1)
      }
    }
  }

  const handleAddToCart = () => {
    if (product) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          product,
          quantity,
        }
      })
      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.name} added to your cart.`,
      })
    }
  }

  const handleReviewSubmitted = () => {
    setRefreshReviews(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-700">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <Navigation />
        <Card className="text-center p-8 mt-16">
          <CardTitle className="text-2xl font-bold text-red-600 mb-4">Product Not Found</CardTitle>
          <CardDescription className="text-gray-600 mb-6">
            The product you are looking for does not exist or has been removed.
          </CardDescription>
          <Button onClick={() => router.push('/catalog')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
          </Button>
        </Card>
      </div>
    )
  }

  const images = product.image_url ? [product.image_url] : []

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-black text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span>Sign up and get 20% off to your first order.</span>
              <Link href="/auth/signup" className="text-white underline hover:text-gray-300 font-medium">
                Sign Up Now
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span>English</span>
              <span>Sign Up</span>
              <span>Login</span>
            </div>
          </div>
        </div>
      </div>

      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-black">Shop</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-black">Men</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-black">T-shirts</Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                {images[selectedImage] ? (
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    width={600}
                    height={600}
                    style={{ objectFit: 'contain' }}
                    className="max-h-full max-w-full"
                  />
                ) : (
                  <Package className="h-24 w-24 text-gray-400" />
                )}
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
                      selectedImage === index ? 'border-black' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-black mb-4">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">4.5/5</span>
                <span className="text-green-600 font-medium">| In Stock</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <p className="text-5xl font-extrabold text-black">
                  ${product.price}
                </p>
                <p className="text-lg text-gray-500 line-through">
                  ${(product.price * 1.5).toFixed(0)}
                </p>
                <Badge className="bg-red-500 text-white">-40%</Badge>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Colors:</h3>
              <div className="flex space-x-3">
                {[
                  { name: 'olive', color: '#8B7355', selected: selectedColor === 'olive' },
                  { name: 'teal', color: '#2D5A5A', selected: selectedColor === 'teal' },
                  { name: 'navy', color: '#1E3A8A', selected: selectedColor === 'navy' }
                ].map((colorOption) => (
                  <button
                    key={colorOption.name}
                    onClick={() => setSelectedColor(colorOption.name)}
                    className={`w-12 h-12 rounded-full border-2 ${
                      colorOption.selected ? 'border-black' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: colorOption.color }}
                  >
                    {colorOption.selected && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Size:</h3>
              <div className="flex space-x-3">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <Button
                    key={size}
                    variant={size === selectedSize ? 'default' : 'outline'}
                    size="lg"
                    className={`w-16 h-12 ${
                      size === selectedSize 
                        ? 'bg-black text-white' 
                        : 'border-gray-300 text-gray-700 hover:border-black'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange('decrement')}
                    disabled={quantity <= 1}
                    className="h-12 w-12"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-lg font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange('increment')}
                    disabled={quantity >= product.stock}
                    className="h-12 w-12"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    size="lg"
                    className="bg-black hover:bg-gray-800 text-white px-8 h-12"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <WishlistButton
                    product={product}
                    variant="outline"
                    size="lg"
                    className="px-4 h-12 border-gray-300"
                  />
                </div>
              </div>

              {product.stock > 0 && (
                <p className="text-sm text-gray-600">
                  In Stock: <span className="font-semibold">{product.stock} units</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'details', label: 'Product Details' },
                { id: 'reviews', label: 'Rating & Reviews' },
                { id: 'faq', label: 'FAQs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <ReviewForm 
                  productId={product.id} 
                  onReviewSubmitted={handleReviewSubmitted}
                />
                <ReviewsList 
                  productId={product.id} 
                  refreshTrigger={refreshReviews}
                />
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-black mb-8">YOU MIGHT ALSO LIKE</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="group hover:shadow-lg transition-shadow border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">-20%</Badge>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/80">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Related Product {item}</h3>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-500">(4.0)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">$120</span>
                      <span className="text-sm text-gray-500 line-through">$150</span>
                    </div>
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">
                      Add To Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-8">STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2>
            <div className="max-w-md mx-auto">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 px-4 py-3 rounded-l-md border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-r-md rounded-l-none">
                  Subscribe to Newsletter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-black">SHOP.CO</h3>
              <p className="text-gray-600">
                We have clothes that suits your style and which you're proud to wear. From women to men.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
                  <span className="sr-only">Twitter</span>
                  t
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
                  <span className="sr-only">Facebook</span>
                  f
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
                  <span className="sr-only">Instagram</span>
                  i
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
                  <span className="sr-only">GitHub</span>
                  g
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-black">COMPANY</h4>
              <div className="space-y-2 text-gray-600">
                <Link href="/about" className="block hover:text-black">About</Link>
                <Link href="/features" className="block hover:text-black">Features</Link>
                <Link href="/works" className="block hover:text-black">Works</Link>
                <Link href="/career" className="block hover:text-black">Career</Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-black">HELP</h4>
              <div className="space-y-2 text-gray-600">
                <Link href="/support" className="block hover:text-black">Customer Support</Link>
                <Link href="/delivery" className="block hover:text-black">Delivery Details</Link>
                <Link href="/terms" className="block hover:text-black">Terms & Conditions</Link>
                <Link href="/privacy" className="block hover:text-black">Privacy Policy</Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-black">FAQ</h4>
              <div className="space-y-2 text-gray-600">
                <Link href="/account" className="block hover:text-black">Account</Link>
                <Link href="/manage-deliveries" className="block hover:text-black">Manage Deliveries</Link>
                <Link href="/orders" className="block hover:text-black">Orders</Link>
                <Link href="/payments" className="block hover:text-black">Payments</Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-black">RESOURCES</h4>
              <div className="space-y-2 text-gray-600">
                <Link href="/ebook" className="block hover:text-black">Free eBook</Link>
                <Link href="/tutorial" className="block hover:text-black">Development Tutorial</Link>
                <Link href="/blog" className="block hover:text-black">How to - Blog</Link>
                <Link href="/youtube" className="block hover:text-black">Youtube Playlist</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-300 mt-12 pt-8 flex justify-between items-center">
            <p className="text-gray-600">Shop.co © 2000-2023, All Rights Reserved</p>
            <div className="flex space-x-4">
              <span className="text-gray-600">VISA</span>
              <span className="text-gray-600">Mastercard</span>
              <span className="text-gray-600">PayPal</span>
              <span className="text-gray-600">Apple Pay</span>
              <span className="text-gray-600">Google Pay</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Status Badge */}
      <div className="fixed bottom-4 right-4">
        <Badge variant="secondary" className="text-sm">
          🛍️ Week 5: Cart & Checkout
        </Badge>
      </div>
    </div>
  )
}