import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get sales data
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            price
          )
        )
      `)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (ordersError) {
      console.error('Error fetching orders:', ordersError)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    // Get product data
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    if (productsError) {
      console.error('Error fetching products:', productsError)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    // Get user data
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Calculate analytics
    const analytics = calculateAnalytics(orders || [], products || [], users || [])

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error('Error in analytics API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateAnalytics(orders: any[], products: any[], users: any[]) {
  // Sales metrics
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0)
  const totalOrders = orders.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Order status breakdown
  const orderStatusBreakdown = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})

  // Daily sales data for charts
  const dailySales = orders.reduce((acc, order) => {
    const date = new Date(order.created_at).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { date, revenue: 0, orders: 0 }
    }
    acc[date].revenue += parseFloat(order.total_amount)
    acc[date].orders += 1
    return acc
  }, {})

  const dailySalesArray = Object.values(dailySales).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Top selling products
  const productSales = orders.reduce((acc, order) => {
    order.order_items?.forEach((item: any) => {
      const productId = item.product_id
      if (!acc[productId]) {
        acc[productId] = {
          productId,
          name: item.products?.name || 'Unknown Product',
          sales: 0,
          revenue: 0,
          quantity: 0
        }
      }
      acc[productId].sales += 1
      acc[productId].revenue += parseFloat(item.price) * item.quantity
      acc[productId].quantity += item.quantity
    })
    return acc
  }, {})

  const topProducts = Object.values(productSales)
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 10)

  // Customer metrics
  const totalCustomers = users.length
  const newCustomers = users.filter(user => {
    const userDate = new Date(user.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return userDate >= thirtyDaysAgo
  }).length

  // Product metrics
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.is_active).length
  const outOfStockProducts = products.filter(p => p.stock === 0).length

  // Monthly comparison (if we have enough data)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const currentMonthOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at)
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
  })

  const lastMonthOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at)
    return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear
  })

  const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0)
  const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0)
  const revenueGrowth = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

  return {
    overview: {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      totalCustomers,
      newCustomers,
      totalProducts,
      activeProducts,
      outOfStockProducts,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100
    },
    charts: {
      dailySales: dailySalesArray,
      orderStatusBreakdown,
      topProducts
    },
    metrics: {
      conversionRate: totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0,
      averageOrderValue,
      revenueGrowth
    }
  }
}
