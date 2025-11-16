import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken, getTokenFromCookies } from '@/lib/auth'

const prisma = new PrismaClient()

// Helper to verify admin auth
async function verifyAdminAuth(request: NextRequest) {
  try {
    const token = getTokenFromCookies(request.cookies)
    if (!token) return null
    const decoded = await verifyToken(token)
    return decoded
  } catch (error) {
    return null
  }
}

// GET single surat jalan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const surat = await prisma.suratJalan.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: {
            urutan: 'asc',
          },
        },
      },
    })

    if (!surat) {
      return NextResponse.json(
        { error: 'Surat jalan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(surat)
  } catch (error) {
    console.error('Error fetching surat jalan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch surat jalan' },
      { status: 500 }
    )
  }
}

// PUT update surat jalan
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const auth = await verifyAdminAuth(request)
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { items, ...data } = body

    // Delete existing items and create new ones
    await prisma.suratJalanItem.deleteMany({
      where: { suratId: id },
    })

    // Update surat with new items
    const surat = await prisma.suratJalan.update({
      where: { id },
      data: {
        ...data,
        tanggal: new Date(data.tanggal),
        items: {
          create: items.map((item: any, idx: number) => ({
            urutan: idx + 1,
            jenisUnit: item.jenisUnit,
            seri: item.seri,
            lokasi: item.lokasi,
            keterangan: item.keterangan || null,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(surat)
  } catch (error) {
    console.error('Error updating surat jalan:', error)
    return NextResponse.json(
      { error: 'Failed to update surat jalan' },
      { status: 500 }
    )
  }
}

// DELETE surat jalan
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const auth = await verifyAdminAuth(request)
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    // Delete items first (cascade delete)
    await prisma.suratJalanItem.deleteMany({
      where: { suratId: id },
    })

    // Then delete surat
    await prisma.suratJalan.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting surat jalan:', error)
    return NextResponse.json(
      { error: 'Failed to delete surat jalan' },
      { status: 500 }
    )
  }
}
