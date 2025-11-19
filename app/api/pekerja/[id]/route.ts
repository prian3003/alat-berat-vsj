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

// GET single worker
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const pekerja = await prisma.pekerja.findUnique({
      where: { id },
    })

    if (!pekerja) {
      return NextResponse.json(
        { error: 'Worker not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(pekerja)
  } catch (error) {
    console.error('Error fetching worker:', error)
    return NextResponse.json(
      { error: 'Failed to fetch worker' },
      { status: 500 }
    )
  }
}

// PUT update worker
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

    const pekerja = await prisma.pekerja.update({
      where: { id },
      data: {
        nama: body.nama,
        jabatan: body.jabatan,
        nomorTelepon: body.nomorTelepon || null,
        alamat: body.alamat || null,
        status: body.status || 'aktif',
      },
    })

    return NextResponse.json(pekerja)
  } catch (error) {
    console.error('Error updating worker:', error)
    return NextResponse.json(
      { error: 'Failed to update worker' },
      { status: 500 }
    )
  }
}

// DELETE worker
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
    await prisma.pekerja.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting worker:', error)
    return NextResponse.json(
      { error: 'Failed to delete worker' },
      { status: 500 }
    )
  }
}
