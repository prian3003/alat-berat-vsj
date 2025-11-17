import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromCookies } from '@/lib/auth'

// Create Supabase admin client for admin operations
const getSupabaseAdmin = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export async function GET(request: NextRequest) {
  try {
    // Check if this is an admin request (has auth token)
    const token = getTokenFromCookies(request.cookies)
    const isAdmin = token && await verifyToken(token)

    const supabase = isAdmin ? getSupabaseAdmin() : await createServerClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    let query = supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true })

    // Only filter by published for non-admin users
    if (!isAdmin) {
      query = query.eq('published', true)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Gallery GET error:', error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Gallery fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = getTokenFromCookies(request.cookies)
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()
    const body = await request.json()

    // Map form data to database fields, only include fields that should be persisted
    const galleryData = {
      title: body.title,
      description: body.description,
      image_url: body.media_type === 'video' ? null : body.image_url,
      video_url: body.media_type === 'video' ? body.video_url : null,
      category: body.category,
      sort_order: body.sort_order,
      published: body.published,
      media_type: body.media_type || 'image',
      thumbnail_url: body.media_type === 'video' ? body.thumbnail_url : null,
      duration: body.media_type === 'video' ? body.duration : null
    }

    const { data, error } = await supabase
      .from('gallery')
      .insert([galleryData])
      .select()

    if (error) {
      console.error('Supabase INSERT error:', error)
      console.error('Attempted data:', galleryData)
      throw error
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Gallery POST error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create gallery image'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
