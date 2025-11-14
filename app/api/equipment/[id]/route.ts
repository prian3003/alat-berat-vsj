import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET single equipment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const equipment = await prisma.heavyEquipment.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: {
            isPrimary: 'desc',
          },
        },
      },
    })

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(equipment)
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    )
  }
}

// PUT update equipment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { images, specifications, pricePerHour, ...data } = body

    // Delete existing images and create new ones
    await prisma.equipmentImage.deleteMany({
      where: { equipmentId: params.id },
    })

    // Update equipment with new images
    const equipment = await prisma.heavyEquipment.update({
      where: { id: params.id },
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

    return NextResponse.json(equipment)
  } catch (error) {
    console.error('Error updating equipment:', error)
    return NextResponse.json(
      { error: 'Failed to update equipment' },
      { status: 500 }
    )
  }
}

// DELETE equipment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.heavyEquipment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting equipment:', error)
    return NextResponse.json(
      { error: 'Failed to delete equipment' },
      { status: 500 }
    )
  }
}
