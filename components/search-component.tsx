'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface SearchResult {
  id: string
  name: string
  price: number
  image_url?: string
  slug: string
  categories?: {
    name: string
  }
}

interface SearchComponentProps {
  onSearch?: (term: string) => void
  placeholder?: string
  showResults?: boolean
}

export function SearchComponent({ 
  onSearch, 
  placeholder = "Search products...", 
  showResults = true 
}: SearchComponentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 2) {
        setResults([])
        setShowDropdown(false)
        return
      }

      setIsSearching(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            price,
            image_url,
            slug,
            categories (
              name
            )
          `)
          .eq('is_active', true)
          .ilike('name', `%${searchTerm}%`)
          .limit(5)

        if (error) {
          console.error('Search error:', error)
        } else {
          setResults(data || [])
          setShowDropdown(true)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(searchProducts, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    } else {
      // Default behavior: navigate to catalog with search term
      window.location.href = `/catalog?search=${encodeURIComponent(searchTerm)}`
    }
    setShowDropdown(false)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setResults([])
    setShowDropdown(false)
  }

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && showDropdown && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isSearching ? (
              <div className="p-4 text-center text-gray-500">
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/catalog/${product.slug}`}
                    className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${product.price.toFixed(2)}
                        </p>
                        {product.categories && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {product.categories.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
                {results.length === 5 && (
                  <div className="px-4 py-2 text-center">
                    <Link
                      href={`/catalog?search=${encodeURIComponent(searchTerm)}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      View all results for "{searchTerm}"
                    </Link>
                  </div>
                )}
              </div>
            ) : searchTerm.length >= 2 ? (
              <div className="p-4 text-center text-gray-500">
                No products found for "{searchTerm}"
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
