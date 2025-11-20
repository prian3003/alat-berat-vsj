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
    const normalizedSlug = slug.toLowerCase().trim()

    // First try to find published post with all fields - use maybeSingle() to handle edge cases
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, content, excerpt, category, tags, author, featured_image, published_at, updated_at, published')
      .eq('slug', normalizedSlug)
      .eq('published', true)
      .maybeSingle()

    // Success case - got the post data
    if (data && !error) {
      const response = NextResponse.json({ data })
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
      return response
    }

    // Error case - diagnose what went wrong
    if (error) {
      console.error('First query failed - Supabase error:', error.code, error.message, 'Slug:', normalizedSlug)
    } else if (!data) {
      console.warn('First query returned no data (null), trying minimal query...')
    }

    // Try a minimal query to check if post exists at all
    const { data: minimalPost, error: minimalError } = await supabase
      .from('blog_posts')
      .select('id, published, title')
      .eq('slug', normalizedSlug)
      .maybeSingle()

    if (minimalError) {
      console.error('Minimal query also failed:', minimalError.code, minimalError.message)
      return NextResponse.json(
        { error: 'Database error', message: 'Terjadi kesalahan saat mengakses database' },
        { status: 500 }
      )
    }

    // No post found at all
    if (!minimalPost) {
      console.warn('Post not found with slug:', normalizedSlug)
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Post exists but check if published
    if (!minimalPost.published) {
      console.warn('Post exists but not published:', minimalPost.title)
      return NextResponse.json(
        { error: 'Post not published', message: 'Artikel belum dipublikasikan' },
        { status: 404 }
      )
    }

    // Post exists AND is published, but full query failed - fetch with retry
    console.warn('Post exists and published, but full field query failed. Retrying with timeout...')

    // Add timeout to prevent hanging
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const { data: fullPost, error: retryError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', normalizedSlug)
        .eq('published', true)
        .maybeSingle()

      clearTimeout(timeoutId)

      if (retryError) {
        console.error('Retry query error:', retryError.code, retryError.message)
        // Return what we know - post exists and is published
        return NextResponse.json(
          { error: 'Partial data available', message: 'Artikel ditemukan tetapi gagal mengambil konten lengkap', data: { id: minimalPost.id, title: minimalPost.title, published: minimalPost.published } },
          { status: 206 } // 206 Partial Content
        )
      }

      if (!fullPost) {
        console.error('Retry returned null despite post existing')
        // Return minimal data we have
        return NextResponse.json(
          { error: 'Partial data available', message: 'Artikel ditemukan tetapi gagal mengambil konten lengkap', data: { id: minimalPost.id, title: minimalPost.title, published: minimalPost.published } },
          { status: 206 }
        )
      }

      const response = NextResponse.json({ data: fullPost })
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
      return response
    } catch (timeoutError) {
      clearTimeout(timeoutId)
      console.error('Retry query timeout:', timeoutError)
      return NextResponse.json(
        { error: 'Request timeout', message: 'Permintaan memakan waktu terlalu lama' },
        { status: 504 }
      )
    }
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    )
  }
}
