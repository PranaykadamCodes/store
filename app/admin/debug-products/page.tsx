'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { supabase } from '@/lib/supabase'

function DebugProductsContent() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    console.log('🔄 Products state changed:', products.length, products)
  }, [products])

  const fetchProducts = async () => {
    try {
      console.log('🔍 Fetching products...')
      console.log('🔍 Supabase client:', supabase)
      console.log('🔍 Environment check:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      })
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('created_at', { ascending: false })

      console.log('📦 Raw data:', data)
      console.log('📦 Data type:', typeof data)
      console.log('📦 Data length:', data?.length)
      console.log('❌ Error:', error)

      if (error) {
        setError(error.message)
        console.error('Error fetching products:', error)
      } else {
        console.log('✅ Setting products...')
        console.log('✅ Data before setting:', data)
        setProducts(data || [])
        console.log('✅ Products state updated')
        
        // Force a re-render check
        setTimeout(() => {
          console.log('✅ Products state after timeout:', products.length)
        }, 1000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
      console.log('✅ Loading set to false')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug Products Page</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Products Count: {products.length}</h2>
          
          {products.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No products found</p>
          ) : (
            <div className="space-y-4">
              {products.map((product, index) => (
                <div key={product.id || index} className="border border-gray-200 dark:border-gray-600 rounded p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Price: ${product.price}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Stock: {product.stock}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Category: {product.categories?.name || 'No category'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Active: {product.is_active ? 'Yes' : 'No'}</p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-blue-600">Raw Data</summary>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2 overflow-auto">
                      {JSON.stringify(product, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={fetchProducts}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh Products
        </button>
      </div>
    </div>
  )
}

export default function DebugProductsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DebugProductsContent />
    </ProtectedRoute>
  )
}
