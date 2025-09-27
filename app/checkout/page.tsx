'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { 
  CreditCard, 
  Truck, 
  Shield, 
  ArrowLeft,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getStripe } from '@/lib/stripe-client'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { state: cartState, dispatch } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  })

  useEffect(() => {
    if (cartState.items.length === 0) {
      router.push('/cart')
    }
  }, [cartState.items.length, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async () => {
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || !shippingInfo.address) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartState.items,
          customerEmail: shippingInfo.email,
          userId: user?.id,
        }),
      })

      const { sessionId } = await response.json()

      if (sessionId) {
        const stripe = await getStripe()
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId })
          if (error) {
            console.error('Stripe checkout error:', error)
            alert('Failed to redirect to checkout')
          }
        }
      } else {
        throw new Error('No session ID received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to process checkout')
    } finally {
      setLoading(false)
    }
  }

  if (cartState.items.length === 0) {
    return null // Will redirect to cart
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Shipping Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Secure payment processing powered by Stripe
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    You'll be redirected to Stripe's secure checkout page
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        {item.product.image_url || item.product.imageUrl ? (
                          <Image
                            src={item.product.image_url || item.product.imageUrl || ''}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${cartState.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${cartState.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                {/* Security Badges */}
                <div className="text-center text-xs text-gray-500 space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="h-3 w-3" />
                    <span>SSL Encrypted</span>
                  </div>
                  <p>Your payment information is secure</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
