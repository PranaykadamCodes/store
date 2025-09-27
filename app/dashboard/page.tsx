'use client'

import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

function DashboardContent() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome, {user?.email || 'User'}!
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">User Info:</h2>
          <p>Email: {user?.email}</p>
          <p>User ID: {user?.id}</p>
          <p>Role: {user?.user_metadata?.role || 'customer'}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a 
                href="/admin" 
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
              >
                Admin Dashboard
              </a>
              <a 
                href="/admin-products-bypass" 
                className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
              >
                View Products (Bypass)
              </a>
              <a 
                href="/test-products" 
                className="block w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-center"
              >
                Test Products (No Auth)
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Debug Links</h3>
            <div className="space-y-2">
              <a 
                href="/env-test" 
                className="block w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-center"
              >
                Environment Test
              </a>
              <a 
                href="/admin/debug-products" 
                className="block w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-center"
              >
                Debug Products
              </a>
              <a 
                href="/admin/direct-products" 
                className="block w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-center"
              >
                Direct Products
              </a>
            </div>
          </div>
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