import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { eq, and, desc, ilike } from 'drizzle-orm'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
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

    const adminCategories = await db.query.categories.findMany({
      orderBy: [desc(categories.createdAt)],
    })

    return NextResponse.json(adminCategories)
  } catch (error) {
    console.error('Error fetching admin categories:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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

    const { name, description, slug, image_url, isActive = true } = await req.json()

    if (!name || !name.trim()) {
      return new NextResponse('Category name is required', { status: 400 })
    }

    // Generate slug if not provided
    const finalSlug = slug || name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const [newCategory] = await db.insert(categories).values({
      name: name.trim(),
      description: description?.trim() || null,
      slug: finalSlug,
      image_url: image_url?.trim() || null,
      isActive: isActive,
    }).returning()

    if (!newCategory) {
      throw new Error('Failed to create category')
    }

    return NextResponse.json({ message: 'Category created successfully', category: newCategory }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
