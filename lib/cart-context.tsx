'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Product } from '@/types'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  size?: string
  color?: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; size?: string; color?: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, size, color } = action.payload
      const existingItem = state.items.find(
        item => item.product.id === product.id && item.size === size && item.color === color
      )

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
        return calculateTotals({ ...state, items: updatedItems })
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${size || 'default'}-${color || 'default'}`,
          product,
          quantity,
          size,
          color,
        }
        return calculateTotals({ ...state, items: [...state.items, newItem] })
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      return calculateTotals({ ...state, items: updatedItems })
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id })
      }
      
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
      return calculateTotals({ ...state, items: updatedItems })
    }

    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 }

    case 'LOAD_CART':
      return calculateTotals({ ...state, items: action.payload })

    default:
      return state
  }
}

const calculateTotals = (state: CartState): CartState => {
  const total = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  return { ...state, total, itemCount }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Cart helper functions
export const cartHelpers = {
  addToCart: (
    dispatch: React.Dispatch<CartAction>,
    product: Product,
    quantity: number = 1,
    size?: string,
    color?: string
  ) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, size, color } })
  },

  removeFromCart: (dispatch: React.Dispatch<CartAction>, itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
  },

  updateQuantity: (dispatch: React.Dispatch<CartAction>, itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } })
  },

  clearCart: (dispatch: React.Dispatch<CartAction>) => {
    dispatch({ type: 'CLEAR_CART' })
  },
}
