'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState('Loading...')
  const [products, setProducts] = useState([])

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Testing Supabase connection...')
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(5)

        if (error) {
          setStatus(`Error: ${error.message}`)
        } else {
          setStatus(`Success! Found ${data?.length || 0} products`)
          setProducts(data || [])
        }
      } catch (err) {
        setStatus(`Connection error: ${err}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="mb-4">Status: {status}</p>
        {products.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Products:</h2>
            <ul className="list-disc list-inside">
              {products.map((product: any) => (
                <li key={product.id}>{product.name} - ${product.price}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
