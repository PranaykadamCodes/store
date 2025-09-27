'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestCatalogPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Starting to fetch products...')
        
        // Test basic connection
        const { data: testData, error: testError } = await supabase
          .from('products')
          .select('id, name')
          .limit(5)
        
        console.log('Test query result:', { testData, testError })
        
        if (testError) {
          console.error('Test query error:', testError)
          setError(testError.message)
          return
        }

        // Full query
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(name, slug)')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10)

        console.log('Full query result:', { data, error })
        
        if (error) {
          console.error('Full query error:', error)
          setError(error.message)
        } else {
          setProducts(data || [])
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div>Loading products...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>Test Catalog Page</h1>
      <p>Found {products.length} products</p>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  )
}
