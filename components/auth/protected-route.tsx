'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'customer'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [roleLoading, setRoleLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user && requiredRole) {
      // Fetch user role from database
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

      // Add a small delay to ensure user data is fully loaded
      const timeoutId = setTimeout(() => {
        fetchUserRole()
      }, 100)

      return () => clearTimeout(timeoutId)
    } else {
      setRoleLoading(false)
    }
  }, [user, loading, requiredRole, router])

  useEffect(() => {
    console.log('🔄 Role check effect:', { roleLoading, requiredRole, userRole })
    
    // Only redirect if we're sure about the role and it doesn't match
    if (!roleLoading && requiredRole && userRole && userRole !== requiredRole) {
      console.log('❌ Access denied - redirecting to dashboard')
      console.log('   Required role:', requiredRole)
      console.log('   User role:', userRole)
      router.push('/dashboard') // Redirect to regular dashboard if not authorized
    }
  }, [roleLoading, requiredRole, userRole, router])

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
