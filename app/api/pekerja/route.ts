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

// GET all workers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status ? { status } : {}

    const pekerja = await prisma.pekerja.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(pekerja)
  } catch (error) {
    console.error('Error fetching workers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workers' },
      { status: 500 }
    )
  }
}

// POST create new worker
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdminAuth(request)
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const pekerja = await prisma.pekerja.create({
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
    console.error('Error creating worker:', error)
    return NextResponse.json(
      { error: 'Failed to create worker' },
      { status: 500 }
    )
  }
}
