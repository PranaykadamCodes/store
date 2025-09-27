'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { supabase } from '@/lib/supabase'

function DirectProductsContent() {
  const [rawData, setRawData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Direct fetch starting...')
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        console.log('📦 Direct fetch result:', { data, error })
        
        setRawData({ data, error })
      } catch (err) {
        console.error('❌ Direct fetch error:', err)
        setRawData({ error: err })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
        <h1 className="text-2xl font-bold mb-6">Direct Products Test</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Raw Response:</h2>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </div>

        {rawData?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {rawData.error.message}
          </div>
        )}

        {rawData?.data && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              Products ({rawData.data.length}):
            </h2>
            
            {rawData.data.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">No products found</p>
            ) : (
              <div className="space-y-4">
                {rawData.data.map((product: any, index: number) => (
                  <div key={product.id || index} className="border border-gray-200 dark:border-gray-600 rounded p-4">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">Price: ${product.price}</p>
                    <p className="text-gray-600 dark:text-gray-300">Stock: {product.stock}</p>
                    <p className="text-gray-600 dark:text-gray-300">Active: {product.is_active ? 'Yes' : 'No'}</p>
                    <p className="text-gray-600 dark:text-gray-300">ID: {product.id}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DirectProductsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DirectProductsContent />
    </ProtectedRoute>
  )
}
