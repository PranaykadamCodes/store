'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LogOut, 
  ArrowLeft,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Package,
  User,
  Calendar,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'

interface Order {
  id: string
  userId: string
  totalAmount: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: string
  billingAddress: string
  stripePaymentIntentId: string | null
  createdAt: string
  updatedAt: string
  orderItems: {
    id: string
    productId: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      image_url: string | null
    }
  }[]
  user: {
    id: string
    email: string
    name: string | null
  }
}

export default function AdminOrdersPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const ordersPerPage = 10

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      // Check if user is admin before fetching orders
      checkAdminAndFetch()
    }
  }, [user, loading, router, currentPage, statusFilter])

  const checkAdminAndFetch = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user?.id)
        .single()

      if (userError || !userData || userData.role !== 'admin') {
        router.push('/auth/login')
        return
      }

      // User is admin, fetch orders
      fetchOrders()
    } catch (error) {
      console.error('Error checking admin status:', error)
      router.push('/auth/login')
    }
  }

  const fetchOrders = async () => {
    setLoadingOrders(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ordersPerPage.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      setOrders(data.orders || [])
      setTotalPages(Math.ceil(data.total / ordersPerPage))
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      // Refresh orders
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'paid':
        return 'default'
      case 'shipped':
        return 'outline'
      case 'delivered':
        return 'success'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">Orders Management</span>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search orders by ID, customer email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchOrders}>
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({orders.length})</CardTitle>
            <CardDescription>
              Manage and track all customer orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingOrders ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Loading orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Order #{order.id.substring(0, 8).toUpperCase()}</h3>
                          <p className="text-sm text-gray-600">
                            Customer: {order.user?.name || order.user?.email || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusBadgeVariant(order.status)} className="mb-2">
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <p className="text-lg font-bold">
                            <DollarSign className="inline h-4 w-4 mr-1" />
                            {order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-1">Shipping Address</h4>
                          <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-1">Billing Address</h4>
                          <p className="text-sm text-gray-600">{order.billingAddress}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Items ({order.orderItems.length})</h4>
                        <div className="space-y-2">
                          {order.orderItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 text-sm">
                              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                <Package className="h-4 w-4 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-gray-600">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                              </div>
                              <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusUpdate(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
