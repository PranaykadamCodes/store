import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data: wishlistItems, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_url,
          slug,
          is_active
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching wishlist:', error)
      return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
    }

    return NextResponse.json({ wishlistItems: wishlistItems || [] })
  } catch (error) {
    console.error('Error in wishlist API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, productId } = await request.json()

    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID are required' }, { status: 400 })
    }

    // Check if item already exists in wishlist
    const { data: existingItem, error: checkError } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking wishlist:', checkError)
      return NextResponse.json({ error: 'Failed to check wishlist' }, { status: 500 })
    }

    if (existingItem) {
      return NextResponse.json({ error: 'Item already in wishlist' }, { status: 400 })
    }

    // Add item to wishlist
    const { data: wishlistItem, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: userId,
        product_id: productId
      })
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_url,
          slug,
          is_active
        )
      `)
      .single()

    if (error) {
      console.error('Error adding to wishlist:', error)
      return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 })
    }

    return NextResponse.json({ wishlistItem })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const productId = searchParams.get('productId')

    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID are required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) {
      console.error('Error removing from wishlist:', error)
      return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
