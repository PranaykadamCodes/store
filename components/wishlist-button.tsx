'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useWishlist } from '@/lib/wishlist-context'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Heart, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface WishlistButtonProps {
  product: Product
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function WishlistButton({ 
  product, 
  variant = 'outline', 
  size = 'default',
  className = ''
}: WishlistButtonProps) {
  const { user } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const isWishlisted = isInWishlist(product.id)

  const handleToggleWishlist = async () => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    setIsLoading(true)
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id)
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        })
      } else {
        await addToWishlist(product.id)
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={`${className} ${isWishlisted ? 'text-red-600 hover:text-red-700' : ''}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
      )}
    </Button>
  )
}
