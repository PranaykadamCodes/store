'use client'

import { useCart, cartHelpers } from '@/lib/cart-context'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Tag
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      cartHelpers.removeFromCart(dispatch, itemId)
    } else {
      cartHelpers.updateQuantity(dispatch, itemId, newQuantity)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    cartHelpers.removeFromCart(dispatch, itemId)
  }

  const handlePromoCode = () => {
    // Simple promo code logic - in real app, this would validate with backend
    if (promoCode.toLowerCase() === 'welcome10') {
      setAppliedPromo('WELCOME10')
    } else {
      setAppliedPromo(null)
    }
  }

  const getDiscount = () => {
    if (appliedPromo === 'WELCOME10') {
      return state.total * 0.1 // 10% discount
    }
    return 0
  }

  const getFinalTotal = () => {
    return state.total - getDiscount()
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/catalog">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Continue Shopping
              </Button>
            </Link>
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
            <Link href="/catalog">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
            <Badge variant="secondary" className="text-sm">
              {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {item.product.image_url || item.product.imageUrl ? (
                        <Image
                          src={item.product.image_url || item.product.imageUrl || ''}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded" />
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/catalog/${item.product.slug}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      ${item.product.price.toFixed(2)} each
                    </p>
                    {item.size && (
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-sm text-gray-500">Color: {item.color}</p>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[30px] text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handlePromoCode}
                    disabled={!promoCode.trim()}
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Apply
                  </Button>
                </div>
                {appliedPromo && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ Promo code {appliedPromo} applied!
                  </p>
                )}
              </div>

              {/* Order Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedPromo})</span>
                    <span>-${getDiscount().toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                className="w-full bg-black text-white hover:bg-gray-800 mb-4"
                onClick={() => router.push('/checkout')}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>

              {/* Trust Badges */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}