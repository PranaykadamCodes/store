'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

export default function RoleTestPage() {
  const { user, loading } = useAuth()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [roleLoading, setRoleLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    if (!loading && user) {
      console.log('🔍 User from auth context:', user)
      
      const fetchUserRole = async () => {
        try {
          console.log('🔍 Fetching user role for user ID:', user.id)
          
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

          console.log('👤 Role query result:', { data, error })

          if (error) {
            console.error('Error fetching user role:', error)
            setUserRole('customer') // Default to customer
          } else {
            console.log('✅ User role found:', data?.role)
            setUserRole(data?.role || 'customer')
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
          setUserRole('customer') // Default to customer
        } finally {
          setRoleLoading(false)
        }
      }

      fetchUserRole()
    } else if (!loading && !user) {
      setRoleLoading(false)
    }
  }, [user, loading])

  useEffect(() => {
    setDebugInfo({
      authLoading: loading,
      user: user ? {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata
      } : null,
      roleLoading,
      userRole,
      isAdmin: userRole === 'admin'
    })
  }, [loading, user, roleLoading, userRole])

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Role Test Page</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Debug Information:</h2>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Access Test:</h2>
          {user ? (
            <div>
              <p className="mb-2">✅ User is authenticated</p>
              <p className="mb-2">Email: {user.email}</p>
              <p className="mb-2">User ID: {user.id}</p>
              <p className="mb-2">Role from DB: {userRole}</p>
              <p className="mb-2">Role from metadata: {user.user_metadata?.role}</p>
              <p className={`mb-4 ${userRole === 'admin' ? 'text-green-600' : 'text-red-600'}`}>
                Admin Access: {userRole === 'admin' ? '✅ ALLOWED' : '❌ DENIED'}
              </p>
              
              {userRole === 'admin' ? (
                <div className="space-y-2">
                  <a 
                    href="/admin" 
                    className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
                  >
                    Go to Admin Dashboard
                  </a>
                  <a 
                    href="/admin/products" 
                    className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
                  >
                    Go to Admin Products
                  </a>
                </div>
              ) : (
                <div className="text-red-600">
                  <p>❌ You don't have admin access</p>
                  <p className="text-sm mt-2">Expected role: admin, Found role: {userRole}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-600">
              <p>❌ No user authenticated</p>
              <a 
                href="/auth/login" 
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center mt-4"
              >
                Go to Login
              </a>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions:</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="/auth/login" 
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
            >
              Login
            </a>
            <a 
              href="/admin-products-bypass" 
              className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
            >
              Products (Bypass)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
