'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const { state, dispatch } = useCart()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id')
    if (sessionIdParam) {
      setSessionId(sessionIdParam)
      // Create order in database
      createOrder(sessionIdParam)
      // Clear the cart after successful payment
      dispatch({ type: 'CLEAR_CART' })
    }
    setLoading(false)
  }, [searchParams, dispatch])

  const createOrder = async (sessionId: string) => {
    try {
      const orderData = {
        userId: user?.id,
        items: state.items,
        totalAmount: state.total,
        shippingAddress: 'Default shipping address', // In real app, get from form
        billingAddress: 'Default billing address', // In real app, get from form
        stripePaymentIntentId: sessionId
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        console.error('Failed to create order')
      }
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-xl text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Confirmation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-sm">{sessionId || 'Processing...'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-semibold">Confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span>Credit Card</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Email Confirmation</p>
                    <p className="text-sm text-gray-600">
                      You'll receive an order confirmation email shortly with all the details.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-gray-600">
                      Your order is being prepared and will be shipped within 1-2 business days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Tracking Information</p>
                    <p className="text-sm text-gray-600">
                      You'll receive tracking information once your order ships.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button variant="outline" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/orders">
              <Button className="w-full sm:w-auto bg-black text-white hover:bg-gray-800">
                View Order History
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact our{' '}
              <Link href="/support" className="text-blue-600 hover:underline">
                customer support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
