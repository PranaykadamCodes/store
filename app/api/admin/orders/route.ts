import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import { orders, orderItems, products, users } from '@/lib/db/schema'
import { eq, desc, and, count } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify the token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const offset = (page - 1) * limit

    // Build where conditions
    const whereConditions = []
    if (status) {
      whereConditions.push(eq(orders.status, status))
    }
    if (search) {
      whereConditions.push(
        // Add search conditions for order ID, customer name, etc.
        // This is a simplified search - you might want to expand this
      )
    }

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(orders)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const total = totalResult?.count || 0

    // Get orders with user information
    const ordersData = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        status: orders.status,
        total: orders.total,
        shippingAddress: orders.shippingAddress,
        billingAddress: orders.billingAddress,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      ordersData.map(async (order) => {
        const items = await db
          .select({
            id: orderItems.id,
            productId: orderItems.productId,
            quantity: orderItems.quantity,
            price: orderItems.price,
            product: {
              id: products.id,
              name: products.name,
              image: products.image,
            }
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id))

        return {
          ...order,
          items
        }
      })
    )

    return NextResponse.json({
      orders: ordersWithItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}