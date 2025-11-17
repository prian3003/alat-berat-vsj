import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import { verifyToken, getTokenFromCookies } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helper function to verify admin auth
async function verifyAdminAuth(request: NextRequest) {
  try {
    const token = getTokenFromCookies(request.cookies)
    if (!token) {
      return null
    }
    const decoded = await verifyToken(token)
    return decoded
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdminAuth(request)
  if (!auth) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG, JPEG, JPG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (100MB for raw upload, will be compressed to WebP)
    const maxFileSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: `File size exceeds 100MB limit. Received: ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 400 }
      )
    }

    // Generate unique filename with .webp extension
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
    const filePath = `equipment/${fileName}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)

    // Get image metadata for adaptive sizing
    const metadata = await sharp(inputBuffer).metadata()
    const originalWidth = metadata.width || 1920
    const originalHeight = metadata.height || 1080

    // Adaptive sizing: scale down intelligently based on original dimensions
    let targetWidth = 1920
    let targetHeight = 1080

    if (originalWidth > 3840 || originalHeight > 2160) {
      // 8K or larger: downscale to 1440p for web
      targetWidth = 2560
      targetHeight = 1440
    } else if (originalWidth > 1920 || originalHeight > 1080) {
      // Larger than 1080p: keep at 1920x1080
      targetWidth = 1920
      targetHeight = 1080
    } else {
      // Already smaller or equal: use original dimensions
      targetWidth = originalWidth
      targetHeight = originalHeight
    }

    // Convert to WebP with adaptive compression
    let qualityLevel = 85
    const fileSizeMB = file.size / 1024 / 1024

    // Adjust quality based on original file size
    if (fileSizeMB > 50) {
      qualityLevel = 75 // Higher compression for very large files
    } else if (fileSizeMB > 20) {
      qualityLevel = 80
    }

    const webpBuffer = await sharp(inputBuffer)
      .resize(targetWidth, targetHeight, {
        fit: 'inside',
        withoutEnlargement: true,
        position: 'center'
      })
      .webp({
        quality: qualityLevel,
        effort: 6, // Higher effort = better compression but slower
        alphaQuality: 100
      })
      .toBuffer()

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('equipment-images')
      .upload(filePath, webpBuffer, {
        contentType: 'image/webp',
        upsert: false,
        cacheControl: '31536000' // Cache for 1 year
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('equipment-images')
      .getPublicUrl(filePath)

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        path: filePath
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
