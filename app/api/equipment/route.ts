import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'
import { getTokenFromCookies } from '@/lib/auth'

const prisma = new PrismaClient()

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

// GET all equipment
export async function GET() {
  try {
    const equipment = await prisma.heavyEquipment.findMany({
      include: {
        images: {
          orderBy: {
            isPrimary: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(equipment)
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    )
  }
}

// POST create new equipment
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
    const body = await request.json()
    const { images, specifications, pricePerHour, ...data } = body

    // Create equipment with images
    const equipment = await prisma.heavyEquipment.create({
      data: {
        ...data,
        pricePerHour: pricePerHour ? parseFloat(pricePerHour) : null,
        specifications: specifications || {},
        images: images?.length
          ? {
              create: images.map((img: { url: string; isPrimary: boolean }) => ({
                imageUrl: img.url,
                isPrimary: img.isPrimary,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    })

    return NextResponse.json(equipment, { status: 201 })
  } catch (error) {
    console.error('Error creating equipment:', error)
    return NextResponse.json(
      { error: 'Failed to create equipment' },
      { status: 500 }
    )
  }
}
