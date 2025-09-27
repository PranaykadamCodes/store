'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LogOut, 
  Package, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Loader2,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminDashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [roleLoading, setRoleLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      const fetchUserRole = async () => {
        try {
          console.log('🔍 Admin Dashboard - Fetching user role for:', user.id)
          
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

          console.log('👤 Admin Dashboard - Role query result:', { data, error })

          if (error) {
            console.error('Error fetching user role:', error)
            setUserRole('customer')
          } else {
            console.log('✅ Admin Dashboard - User role found:', data?.role)
            setUserRole(data?.role || 'customer')
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
          setUserRole('customer')
        } finally {
          setRoleLoading(false)
        }
      }

      fetchUserRole()
    } else if (!loading) {
      setRoleLoading(false)
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!roleLoading && userRole && userRole !== 'admin') {
      console.log('❌ Admin Dashboard - Access denied, role:', userRole)
      setAccessDenied(true)
    }
  }, [roleLoading, userRole])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You don't have permission to access the admin dashboard.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Your role: {userRole}
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</span>
              </div>
              <Badge variant="default" className="text-sm">
                👑 Admin
              </Badge>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/products">
                  <Button variant="ghost" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Products
                  </Button>
                </Link>
                <Link href="/admin/categories">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Categories
                  </Button>
                </Link>
                <Link href="/admin/orders">
                  <Button variant="ghost" className="w-full justify-start">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Welcome Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back, {user?.user_metadata?.name || user?.email}!</CardTitle>
                  <CardDescription>
                    Manage your e-commerce store from the admin dashboard
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">
                      +5 from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">
                      +0 from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">
                      +2 from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$0.00</div>
                    <p className="text-xs text-muted-foreground">
                      +0% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks you can perform from here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Link href="/admin/products/new">
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Product
                      </Button>
                    </Link>
                    <Link href="/admin/categories/new">
                      <Button variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Category
                      </Button>
                    </Link>
                    <Link href="/admin/analytics">
                      <Button variant="outline" className="w-full">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Analytics
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest actions in your store
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    No recent activity to display
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="fixed bottom-4 right-4">
        <Badge variant="secondary" className="text-sm">
          🛠️ Week 3: Admin Dashboard
        </Badge>
      </div>
    </div>
  )
}