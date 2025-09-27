'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { supabase } from '@/lib/supabase'

function SimpleProductsContent() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      // Simple query without joins first
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error:', error)
      } else {
        setProducts(data || [])
        console.log('Products loaded:', data?.length || 0)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Simple Products Test</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <p className="mb-4">Products found: {products.length}</p>
          
          {products.length > 0 ? (
            <div className="grid gap-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 dark:border-gray-600 rounded p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">${product.price}</p>
                  <p className="text-gray-600 dark:text-gray-300">Stock: {product.stock}</p>
                  <p className="text-gray-600 dark:text-gray-300">Active: {product.is_active ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No products found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SimpleProductsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <SimpleProductsContent />
    </ProtectedRoute>
  )
}
