'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Product } from '@/types'

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: Date
}

interface WishlistState {
  items: WishlistItem[]
  loading: boolean
  error: string | null
}

type WishlistAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: WishlistItem[] }
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }

const WishlistContext = createContext<{
  state: WishlistState
  dispatch: React.Dispatch<WishlistAction>
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
} | null>(null)

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_ITEMS':
      return { ...state, items: action.payload, loading: false, error: null }
    
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] }
    
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.productId !== action.payload) }
    
    case 'CLEAR_WISHLIST':
      return { ...state, items: [] }
    
    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    loading: false,
    error: null,
  })

  const addToWishlist = async (productId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      const data = await response.json()

      if (response.ok) {
        dispatch({ type: 'ADD_ITEM', payload: data.wishlistItem })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error || 'Failed to add to wishlist' })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add to wishlist' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        dispatch({ type: 'REMOVE_ITEM', payload: productId })
      } else {
        const data = await response.json()
        dispatch({ type: 'SET_ERROR', payload: data.error || 'Failed to remove from wishlist' })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove from wishlist' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const isInWishlist = (productId: string): boolean => {
    return state.items.some(item => item.productId === productId)
  }

  return (
    <WishlistContext.Provider value={{ state, dispatch, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
