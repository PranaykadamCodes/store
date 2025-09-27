'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Category } from '@/types'

interface CatalogFiltersProps {
  categories: Category[]
  searchTerm: string
  selectedCategories: string[]
  priceRange: [number, number]
  sortBy: string
}

export function CatalogFilters({ 
  categories, 
  searchTerm, 
  selectedCategories, 
  priceRange, 
  sortBy 
}: CatalogFiltersProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [localSelectedCategories, setLocalSelectedCategories] = useState(selectedCategories)
  const [localPriceRange, setLocalPriceRange] = useState(priceRange)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const newUrl = new URL(window.location.href)
    if (localSearchTerm) {
      newUrl.searchParams.set('search', localSearchTerm)
    } else {
      newUrl.searchParams.delete('search')
    }
    window.location.href = newUrl.toString()
  }

  const handleCategoryChange = (slug: string, checked: boolean) => {
    const newSelectedCategories = checked
      ? [...localSelectedCategories, slug]
      : localSelectedCategories.filter((cat) => cat !== slug)
    
    setLocalSelectedCategories(newSelectedCategories)
    
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('category')
    newSelectedCategories.forEach(cat => {
      newUrl.searchParams.append('category', cat)
    })
    window.location.href = newUrl.toString()
  }

  const handlePriceRangeChange = (value: number) => {
    const newPriceRange: [number, number] = [localPriceRange[0], value]
    setLocalPriceRange(newPriceRange)
    
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('minPrice', newPriceRange[0].toString())
    newUrl.searchParams.set('maxPrice', newPriceRange[1].toString())
    window.location.href = newUrl.toString()
  }

  const clearFilters = () => {
    window.location.href = '/catalog'
  }

  return (
    <>
      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
        <div className="flex space-x-2">
          <input
            id="search"
            type="text"
            placeholder="Search by name..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" size="sm">
            Search
          </Button>
        </div>
      </form>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories?.map((category) => (
            <div key={category.id} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category.slug}`}
                checked={localSelectedCategories.includes(category.slug)}
                onChange={(e) => handleCategoryChange(category.slug, e.target.checked)}
                className="mr-2"
              />
              <label
                htmlFor={`category-${category.slug}`}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Price Range</h3>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={localPriceRange[1]}
            onChange={(e) => handlePriceRangeChange(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${localPriceRange[0]}</span>
            <span>${localPriceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear Filters
      </Button>
    </>
  )
}
