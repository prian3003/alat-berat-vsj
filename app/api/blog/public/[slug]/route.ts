import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role key for reading published posts
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params Promise with timeout protection
    const { slug } = await params

    if (!slug || slug.length === 0) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // First try to find published post
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, content, excerpt, category, tags, author, featured_image, published_at, updated_at, published')
      .eq('slug', slug.toLowerCase().trim())
      .eq('published', true)
      .single()

    if (error) {
      console.error('Supabase error:', error.code, error.message)

      // If PGRST116 (no rows), try without published filter for better error messaging
      if (error.code === 'PGRST116') {
        const { data: anyPost } = await supabase
          .from('blog_posts')
          .select('published')
          .eq('slug', slug.toLowerCase().trim())
          .single()

        if (anyPost && !anyPost.published) {
          return NextResponse.json(
            { error: 'Post not published', message: 'Artikel belum dipublikasikan' },
            { status: 404 }
          )
        }
      }

      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Cache response for 1 hour
    const response = NextResponse.json({ data })
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

    return response
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    )
  }
}
