'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { Button } from '@/components/ui/button'
import { 
  ShoppingCart, 
  Package, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home,
  Settings,
  BarChart3,
  Search,
  Heart,
  ChevronDown
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'

export function Navigation() {
  const { user, signOut } = useAuth()
  const { state: cartState } = useCart()
  const { state: wishlistState } = useWishlist()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    setIsMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      router.push('/catalog')
    }
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-foreground">
              SHOP.CO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1">
              <Link href="/catalog" className="text-muted-foreground hover:text-foreground font-medium">
                Shop
              </Link>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <Link href="/sale" className="text-muted-foreground hover:text-foreground font-medium">
              On Sale
            </Link>
            <Link href="/new-arrivals" className="text-muted-foreground hover:text-foreground font-medium">
              New Arrivals
            </Link>
            <Link href="/brands" className="text-muted-foreground hover:text-foreground font-medium">
              Brands
            </Link>
          </div>

          {/* Search and User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 pr-10"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-0 top-0 h-full rounded-l-none bg-transparent hover:bg-muted"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartState.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartState.itemCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  {wishlistState.items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistState.items.length}
                    </span>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-0 top-0 h-full rounded-l-none"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link href="/catalog" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Shop
                  </Button>
                </Link>
                <Link href="/sale" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    On Sale
                  </Button>
                </Link>
                <Link href="/new-arrivals" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    New Arrivals
                  </Button>
                </Link>
                <Link href="/brands" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Brands
                  </Button>
                </Link>
              </div>

              {/* Mobile User Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {cartState.itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartState.itemCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                </div>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </div>

              {/* User Menu for Mobile */}
              {user && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <div className="text-sm text-gray-600 mb-2">
                    Welcome, {user.email}
                  </div>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  {user.user_metadata?.role === 'admin' && (
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut} 
                    className="w-full justify-start text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}