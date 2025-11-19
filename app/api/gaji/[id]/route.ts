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

// GET single salary record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const gaji = await prisma.gaji.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: {
            urutan: 'asc',
          },
        },
      },
    })

    if (!gaji) {
      return NextResponse.json(
        { error: 'Salary record not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(gaji)
  } catch (error) {
    console.error('Error fetching salary record:', error)
    return NextResponse.json(
      { error: 'Failed to fetch salary record' },
      { status: 500 }
    )
  }
}

// PUT update salary record
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

    // Process items
    const itemsData = items?.map((item: any, idx: number) => ({
      urutan: idx + 1,
      tanggal: new Date(item.tanggal),
      keterangan: item.keterangan,
      jam: item.jam ? parseFloat(item.jam) : null,
      jumlah: parseFloat(item.jumlah),
      tipe: item.tipe || 'regular',
    })) || []

    // Calculate total salary
    const totalGaji = items?.reduce((sum: number, item: any) => sum + parseFloat(item.jumlah), 0) || 0

    // Delete old items
    await prisma.gajiItem.deleteMany({
      where: { gajiId: id },
    })

    // Update salary record
    const gaji = await prisma.gaji.update({
      where: { id },
      data: {
        tipe: data.tipe,
        bulan: data.bulan ? parseInt(data.bulan) : null,
        tahun: data.tahun ? parseInt(data.tahun) : null,
        tanggalMulai: new Date(data.tanggalMulai),
        tanggalSelesai: new Date(data.tanggalSelesai),
        totalGaji,
        keterangan: data.keterangan || null,
        status: data.status || 'draft',
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(gaji)
  } catch (error) {
    console.error('Error updating salary record:', error)
    return NextResponse.json(
      { error: 'Failed to update salary record' },
      { status: 500 }
    )
  }
}

// DELETE salary record
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
    await prisma.gaji.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting salary record:', error)
    return NextResponse.json(
      { error: 'Failed to delete salary record' },
      { status: 500 }
    )
  }
}
