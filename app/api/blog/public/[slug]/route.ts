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

    // First try to find published post - use maybeSingle() to handle edge cases
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, content, excerpt, category, tags, author, featured_image, published_at, updated_at, published')
      .eq('slug', slug.toLowerCase().trim())
      .eq('published', true)
      .maybeSingle()

    if (error) {
      console.error('Supabase error for published post:', error.code, error.message, 'Slug:', slug)

      // If no rows or error, try without published filter for better error messaging
      if (error.code === 'PGRST116' || error) {
        const { data: anyPost, error: anyError } = await supabase
          .from('blog_posts')
          .select('id, published, title')
          .eq('slug', slug.toLowerCase().trim())
          .maybeSingle()

        if (anyError) {
          console.error('Database error searching for post:', anyError.code, anyError.message)
          // Database error
          return NextResponse.json(
            { error: 'Database error', message: 'Terjadi kesalahan saat mengakses database' },
            { status: 500 }
          )
        }

        // anyPost is null if not found, or has data if found
        if (!anyPost) {
          console.warn('Post not found at all with slug:', slug)
          return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        if (anyPost && !anyPost.published) {
          console.warn('Post exists but not published:', anyPost.title)
          return NextResponse.json(
            { error: 'Post not published', message: 'Artikel belum dipublikasikan' },
            { status: 404 }
          )
        }

        // Post exists and IS published but first query had issues
        console.warn('Post exists and published but first query failed. Title:', anyPost.title)
        // Retry fetching full post
        const { data: fullPost, error: retryError } = await supabase
          .from('blog_posts')
          .select('id, slug, title, content, excerpt, category, tags, author, featured_image, published_at, updated_at, published')
          .eq('slug', slug.toLowerCase().trim())
          .eq('published', true)
          .maybeSingle()

        if (retryError || !fullPost) {
          console.error('Retry also failed:', retryError?.message)
          return NextResponse.json(
            { error: 'Failed to fetch post', message: 'Terjadi kesalahan saat mengambil data' },
            { status: 500 }
          )
        }

        return NextResponse.json({ data: fullPost })
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
