import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
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

// Helper function to process video with FFmpeg
async function processVideoWithFFmpeg(
  inputBuffer: Buffer,
  inputMime: string
): Promise<{ outputBuffer: Buffer; format: string; duration: number }> {
  return new Promise((resolve, reject) => {
    const tempDir = path.join('/tmp', `video-${Date.now()}`)
    const inputPath = path.join(tempDir, `input.${inputMime === 'video/mp4' ? 'mp4' : 'webm'}`)
    const outputPath = path.join(tempDir, 'output.mp4')

    // Write input to temp file
    fs.mkdir(tempDir, { recursive: true })
      .then(() => fs.writeFile(inputPath, inputBuffer))
      .then(() => {
        // FFmpeg command: compress video with H.264 codec
        const ffmpeg = spawn('ffmpeg', [
          '-i', inputPath,
          '-c:v', 'libx264', // H.264 codec
          '-preset', 'fast', // fast encoding preset
          '-crf', '28', // Quality (lower = better, 0-51, default 23)
          '-c:a', 'aac', // Audio codec
          '-b:a', '128k', // Audio bitrate
          '-movflags', '+faststart', // Enable streaming
          '-y', // Overwrite output file
          outputPath
        ])

        let stderrOutput = ''
        ffmpeg.stderr.on('data', (data) => {
          stderrOutput += data.toString()
        })

        ffmpeg.on('close', async (code) => {
          try {
            if (code !== 0) {
              reject(new Error(`FFmpeg failed with code ${code}: ${stderrOutput}`))
              return
            }

            // Read compressed video
            const outputBuffer = await fs.readFile(outputPath)

            // Extract duration from ffmpeg output
            const durationMatch = stderrOutput.match(/Duration: (\d+):(\d+):(\d+\.\d+)/)
            const duration = durationMatch
              ? parseInt(durationMatch[1]) * 3600 + parseInt(durationMatch[2]) * 60 + parseFloat(durationMatch[3])
              : 0

            // Cleanup
            await fs.rm(tempDir, { recursive: true, force: true })

            resolve({
              outputBuffer,
              format: 'video/mp4',
              duration
            })
          } catch (error) {
            // Cleanup on error
            fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
            reject(error)
          }
        })

        ffmpeg.on('error', (error) => {
          fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
          reject(error)
        })
      })
      .catch(reject)
  })
}

// Helper function to get video thumbnail (first frame)
async function getVideoThumbnail(inputBuffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const tempDir = path.join('/tmp', `thumb-${Date.now()}`)
    const inputPath = path.join(tempDir, 'input.mp4')
    const outputPath = path.join(tempDir, 'thumbnail.jpg')

    fs.mkdir(tempDir, { recursive: true })
      .then(() => fs.writeFile(inputPath, inputBuffer))
      .then(() => {
        const ffmpeg = spawn('ffmpeg', [
          '-i', inputPath,
          '-ss', '00:00:01', // Get frame at 1 second
          '-vframes', '1', // Extract only 1 frame
          '-vf', 'scale=480:-1', // Scale to 480px width
          '-q:v', '5', // JPEG quality
          '-y',
          outputPath
        ])

        ffmpeg.on('close', async (code) => {
          try {
            if (code !== 0) {
              reject(new Error(`FFmpeg thumbnail generation failed`))
              return
            }
            const thumbnail = await fs.readFile(outputPath)
            await fs.rm(tempDir, { recursive: true, force: true })
            resolve(thumbnail)
          } catch (error) {
            await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
            reject(error)
          }
        })

        ffmpeg.on('error', (error) => {
          fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
          reject(error)
        })
      })
      .catch(reject)
  })
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

    // Determine file type and validate
    const isImage = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)
    const isVideo = ['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type)

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (PNG, JPEG, WebP) and videos (MP4, WebM) are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (500MB for videos, 100MB for images)
    const maxFileSize = isVideo ? 500 * 1024 * 1024 : 100 * 1024 * 1024
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: `File size exceeds ${isVideo ? '500MB' : '100MB'} limit. Received: ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 400 }
      )
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)
    const fileSizeMB = file.size / 1024 / 1024

    let uploadPath: string
    let uploadBuffer: Buffer
    let uploadMimeType: string
    let metadata: any = {}

    if (isImage) {
      // Image processing
      const imgMetadata = await sharp(inputBuffer).metadata()
      const originalWidth = imgMetadata.width || 1920
      const originalHeight = imgMetadata.height || 1080

      // Adaptive sizing
      let targetWidth = 1920
      let targetHeight = 1080

      if (originalWidth > 3840 || originalHeight > 2160) {
        targetWidth = 2560
        targetHeight = 1440
      } else if (originalWidth > 1920 || originalHeight > 1080) {
        targetWidth = 1920
        targetHeight = 1080
      } else {
        targetWidth = originalWidth
        targetHeight = originalHeight
      }

      // Quality tier
      let qualityLevel = 85
      if (fileSizeMB > 50) {
        qualityLevel = 75
      } else if (fileSizeMB > 20) {
        qualityLevel = 80
      }

      uploadBuffer = await sharp(inputBuffer)
        .resize(targetWidth, targetHeight, {
          fit: 'inside',
          withoutEnlargement: true,
          position: 'center'
        })
        .webp({
          quality: qualityLevel,
          effort: 6,
          alphaQuality: 100
        })
        .toBuffer()

      uploadMimeType = 'image/webp'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
      uploadPath = `equipment/${fileName}`
      metadata = { type: 'image', width: targetWidth, height: targetHeight, quality: qualityLevel }
    } else {
      // Video processing
      try {
        const compressed = await processVideoWithFFmpeg(inputBuffer, file.type)
        uploadBuffer = compressed.outputBuffer
        uploadMimeType = 'video/mp4'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`
        uploadPath = `equipment/${fileName}`

        // Generate thumbnail
        const thumbnail = await getVideoThumbnail(compressed.outputBuffer)
        const thumbFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-thumb.jpg`
        const thumbPath = `equipment/${thumbFileName}`

        // Upload thumbnail
        const { data: thumbData, error: thumbError } = await supabase.storage
          .from('equipment-images')
          .upload(thumbPath, thumbnail, {
            contentType: 'image/jpeg',
            upsert: false,
            cacheControl: '31536000'
          })

        if (!thumbError) {
          const { data: { publicUrl: thumbUrl } } = supabase.storage
            .from('equipment-images')
            .getPublicUrl(thumbPath)
          metadata.thumbnailUrl = thumbUrl
        }

        metadata = {
          ...metadata,
          type: 'video',
          duration: compressed.duration,
          originalSize: fileSizeMB.toFixed(2),
          compressedSize: (uploadBuffer.length / 1024 / 1024).toFixed(2)
        }
      } catch (error) {
        console.error('Video processing error:', error)
        return NextResponse.json(
          { error: `Video processing failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
          { status: 500 }
        )
      }
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('equipment-images')
      .upload(uploadPath, uploadBuffer, {
        contentType: uploadMimeType,
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
      .getPublicUrl(uploadPath)

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        path: uploadPath,
        type: metadata.type,
        metadata: metadata
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
