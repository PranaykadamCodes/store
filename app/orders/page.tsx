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
  Eye,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Order, OrderItem } from '@/types'

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders?userId=${user?.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setOrders(data.orders || [])
      } else {
        setError(data.error || 'Failed to fetch orders')
      }
    } catch (err) {
      setError('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-600" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please sign in</h1>
            <p className="text-gray-600 mb-8">You need to be signed in to view your orders.</p>
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
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-red-600 mb-8">{error}</p>
            <Button onClick={fetchOrders}>Try Again</Button>
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
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
            <Link href="/catalog">
              <Button className="bg-black text-white hover:bg-gray-800">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className="font-semibold">Order #{order.id.slice(-8)}</span>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-bold">
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold mb-3">Items ({order.orderItems?.length || 0})</h3>
                      <div className="space-y-3">
                        {order.orderItems?.map((item: OrderItem) => (
                          <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                              {item.product?.image_url || item.product?.imageUrl ? (
                                <Image
                                  src={item.product.image_url || item.product.imageUrl || ''}
                                  alt={item.product.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product?.name}</h4>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {order.shippingAddress}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 pt-4 border-t">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
