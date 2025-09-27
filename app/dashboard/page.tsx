'use client'

import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogOut, User, ShoppingBag, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'

function DashboardContent() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const userRole = user?.user_metadata?.role || 'customer'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.user_metadata?.name || user?.email}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account and orders
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Role Badge */}
        <div className="mb-8">
          <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="text-sm">
            {userRole === 'admin' ? '👑 Admin' : '👤 Customer'}
          </Badge>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">View Profile</div>
              <p className="text-xs text-muted-foreground">
                Manage your personal information
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Total orders placed
              </p>
            </CardContent>
          </Card>

          {userRole === 'admin' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Products in store
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
            <Button variant="outline">
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            {userRole === 'admin' && (
              <Button variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </Button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="fixed bottom-4 right-4">
          <Badge variant="secondary" className="text-sm">
            🚀 Week 2: Authentication Complete
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
