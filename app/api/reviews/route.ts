import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
      .from('reviews')
      .select(`
        *,
        users (
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (productId) {
      query = query.eq('product_id', productId)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    // Add pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: reviews, error } = await query

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }

    // Get average rating for the product
    let averageRating = 0
    let totalReviews = 0

    if (productId) {
      const { data: ratingData, error: ratingError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId)

      if (!ratingError && ratingData) {
        totalReviews = ratingData.length
        averageRating = ratingData.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      }
    }

    return NextResponse.json({ 
      reviews: reviews || [], 
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews 
    })
  } catch (error) {
    console.error('Error in reviews API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, rating, comment } = await request.json()

    if (!userId || !productId || !rating) {
      return NextResponse.json({ error: 'User ID, Product ID, and rating are required' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if user has already reviewed this product
    const { data: existingReview, error: checkError } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing review:', checkError)
      return NextResponse.json({ error: 'Failed to check existing review' }, { status: 500 })
    }

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 })
    }

    // Create new review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        product_id: productId,
        rating,
        comment: comment || null
      })
      .select(`
        *,
        users (
          id,
          name,
          email
        )
      `)
      .single()

    if (error) {
      console.error('Error creating review:', error)
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
