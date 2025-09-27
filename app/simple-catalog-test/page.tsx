'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SimpleCatalogTest() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Starting to fetch products...')
        
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price')
          .eq('is_active', true)
          .limit(5)

        console.log('Query result:', { data, error })
        
        if (error) {
          console.error('Error:', error)
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
      <h1>Simple Catalog Test</h1>
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
