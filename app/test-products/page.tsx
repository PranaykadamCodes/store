'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check auth state
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('🔐 Current session:', session)
      setUser(session?.user || null)
    }

    checkAuth()

    // Fetch products
    const fetchProducts = async () => {
      try {
        console.log('🔍 Fetching products (no auth check)...')
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        console.log('📦 Products data:', data)
        console.log('❌ Products error:', error)

        if (error) {
          console.error('Error:', error.message)
        } else {
          setProducts(data || [])
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
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
        <h1 className="text-2xl font-bold mb-6">Test Products (No Auth Check)</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Auth Status:</h2>
          {user ? (
            <div>
              <p>✅ User logged in: {user.email}</p>
              <p>User ID: {user.id}</p>
            </div>
          ) : (
            <p>❌ No user logged in</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Products ({products.length}):
          </h2>
          
          {products.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No products found</p>
          ) : (
            <div className="space-y-4">
              {products.map((product, index) => (
                <div key={product.id || index} className="border border-gray-200 dark:border-gray-600 rounded p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Price: ${product.price}</p>
                  <p className="text-gray-600 dark:text-gray-300">Stock: {product.stock}</p>
                  <p className="text-gray-600 dark:text-gray-300">Active: {product.is_active ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <a 
            href="/auth/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
          >
            Go to Login
          </a>
          <a 
            href="/admin" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
