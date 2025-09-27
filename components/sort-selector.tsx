'use client'

interface SortSelectorProps {
  sortBy: string
}

export function SortSelector({ sortBy }: SortSelectorProps) {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('sortBy', e.target.value)
    window.location.href = newUrl.toString()
  }

  return (
    <select 
      value={sortBy} 
      onChange={handleSortChange}
      className="w-[180px] px-3 py-2 border border-gray-300 rounded-md"
    >
      <option value="created_at_desc">Newest</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="name_asc">Name: A-Z</option>
      <option value="name_desc">Name: Z-A</option>
    </select>
  )
}
