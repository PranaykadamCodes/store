import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { supabase } from '@/lib/supabase'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || userData.role !== 'admin') {
      return new NextResponse('Forbidden: Admin access required', { status: 403 })
    }

    const orderId = params.id
    const { status, shippingAddress, billingAddress } = await req.json()

    const updateData: { 
      status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
      shippingAddress?: string
      billingAddress?: string
    } = {}

    if (status) updateData.status = status
    if (shippingAddress) updateData.shippingAddress = shippingAddress
    if (billingAddress) updateData.billingAddress = billingAddress

    if (Object.keys(updateData).length === 0) {
      return new NextResponse('No valid fields to update', { status: 400 })
    }

    const [updatedOrder] = await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId))
      .returning()

    if (!updatedOrder) {
      return new NextResponse('Order not found', { status: 404 })
    }

    return NextResponse.json({ message: 'Order updated successfully', order: updatedOrder })
  } catch (error) {
    console.error('Error updating order:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
