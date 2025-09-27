'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Truck, 
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  MapPin,
  CreditCard,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Order, OrderItem } from '@/types'

interface OrderDetailsPageProps {
  params: { id: string }
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && params.id) {
      fetchOrder()
    }
  }, [user, params.id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${params.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setOrder(data.order)
      } else {
        setError(data.error || 'Failed to fetch order')
      }
    } catch (err) {
      setError('Failed to fetch order')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-600" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your order is being processed'
      case 'paid':
        return 'Payment confirmed, preparing your order'
      case 'shipped':
        return 'Your order is on its way'
      case 'delivered':
        return 'Your order has been delivered'
      case 'cancelled':
        return 'Your order has been cancelled'
      default:
        return 'Order status unknown'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please sign in</h1>
            <p className="text-gray-600 mb-8">You need to be signed in to view order details.</p>
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
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The order you are looking for does not exist.'}</p>
            <Link href="/orders">
              <Button>Back to Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  {getStatusIcon(order.status)}
                  <span>Order Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className={`${getStatusColor(order.status)} text-lg px-4 py-2`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <p className="text-gray-600 mt-2">{getStatusDescription(order.status)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Order #{order.id.slice(-8)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems?.map((item: OrderItem) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                        {item.product?.image_url || item.product?.imageUrl ? (
                          <Image
                            src={item.product.image_url || item.product.imageUrl || ''}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product?.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Shipping Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-gray-600 whitespace-pre-line">{order.shippingAddress}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Billing Address</h3>
                    <p className="text-gray-600 whitespace-pre-line">{order.billingAddress}</p>
                  </div>
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
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    <span>Paid with Stripe</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>Confirmation sent to {user.email}</span>
                  </div>
                </div>

                {order.status === 'delivered' && (
                  <Button className="w-full mt-4" variant="outline">
                    Leave Review
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
