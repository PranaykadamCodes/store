'use client'

import { useState } from 'react'
import { useCart, cartHelpers } from '@/lib/cart-context'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AddToCartButtonProps {
  product: Product
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  showQuantity?: boolean
}

export function AddToCartButton({ 
  product, 
  variant = 'default', 
  size = 'default',
  className = '',
  showQuantity = false 
}: AddToCartButtonProps) {
  const { state, dispatch } = useCart()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)

  // Find if this product is already in cart
  const existingItem = state.items.find(item => item.product.id === product.id)
  const currentQuantity = existingItem?.quantity || 0

  const handleAddToCart = async () => {
    if (isAdding) return
    
    setIsAdding(true)
    try {
      cartHelpers.addToCart(dispatch, product, 1)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleIncreaseQuantity = () => {
    if (existingItem) {
      cartHelpers.updateQuantity(dispatch, existingItem.id, existingItem.quantity + 1)
    } else {
      handleAddToCart()
    }
  }

  const handleDecreaseQuantity = () => {
    if (existingItem && existingItem.quantity > 1) {
      cartHelpers.updateQuantity(dispatch, existingItem.id, existingItem.quantity - 1)
    } else if (existingItem) {
      cartHelpers.removeFromCart(dispatch, existingItem.id)
    }
  }

  if (showQuantity && currentQuantity > 0) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecreaseQuantity}
          disabled={isAdding}
          className="h-8 w-8 p-0"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-[20px] text-center">
          {currentQuantity}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleIncreaseQuantity}
          disabled={isAdding}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      variant={variant}
      size={size}
      className={`${className} ${isAdding ? 'opacity-50' : ''}`}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </Button>
  )
}
