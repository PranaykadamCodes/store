'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useWishlist } from '@/lib/wishlist-context'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Trash2, 
  ArrowLeft,
  Package,
  Star
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { useToast } from '@/hooks/use-toast'

export default function WishlistPage() {
  const { user } = useAuth()
  const { state, removeFromWishlist } = useWishlist()
  const { dispatch } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchWishlist()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/wishlist?userId=${user?.id}`)
      const data = await response.json()
      
      if (response.ok) {
        // Update wishlist context
        // This would be handled by the context in a real app
      } else {
        console.error('Failed to fetch wishlist:', data.error)
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId)
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = (product: any) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        quantity: 1,
      }
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please sign in</h1>
            <p className="text-gray-600 mb-8">You need to be signed in to view your wishlist.</p>
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <Badge variant="secondary" className="text-sm">
              {state.items.length} {state.items.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </div>

        {state.items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Start adding items you love to your wishlist.</p>
            <Link href="/catalog">
              <Button className="bg-black text-white hover:bg-gray-800">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {state.items.map((item) => (
              <Card key={item.id} className="group relative overflow-hidden">
                <Link href={`/catalog/${item.product.slug}`}>
                  <div className="aspect-square w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {item.product.image_url || item.product.imageUrl ? (
                      <Image
                        src={item.product.image_url || item.product.imageUrl || ''}
                        alt={item.product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Package className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/catalog/${item.product.slug}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                      {item.product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">(0)</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.product.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleAddToCart(item.product)}
                      className="flex-1 bg-black text-white hover:bg-gray-800"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    
                    <Button
                      onClick={() => handleRemoveFromWishlist(item.product.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
