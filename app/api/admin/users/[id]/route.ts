import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
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

    const userId = params.id
    const { role, isActive, name } = await req.json()

    const updateData: { 
      role?: 'admin' | 'customer'
      isActive?: boolean
      name?: string
    } = {}

    if (role) updateData.role = role
    if (typeof isActive === 'boolean') updateData.isActive = isActive
    if (name) updateData.name = name

    if (Object.keys(updateData).length === 0) {
      return new NextResponse('No valid fields to update', { status: 400 })
    }

    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning()

    if (!updatedUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json({ message: 'User updated successfully', user: updatedUser })
  } catch (error) {
    console.error('Error updating user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
