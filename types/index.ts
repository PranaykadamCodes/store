export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'customer'
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description?: string
  slug: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  categoryId?: string
  category?: Category
  imageUrl?: string
  images?: string[]
  slug: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  user?: User
  totalAmount: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: string
  billingAddress: string
  stripePaymentIntentId?: string
  orderItems?: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Product
  quantity: number
  price: number
  createdAt: Date
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product?: Product
  createdAt: Date
}

export interface Review {
  id: string
  productId: string
  product?: Product
  userId: string
  user?: User
  rating: number
  comment?: string
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  product?: Product
  quantity: number
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  inStock?: boolean
}
