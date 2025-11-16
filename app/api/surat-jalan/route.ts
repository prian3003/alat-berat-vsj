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

// GET all surat jalan with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    // Build where clause
    let where: any = {}

    if (status) {
      where.status = status
    }

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0)
      where.tanggal = {
        gte: startDate,
        lte: endDate,
      }
    }

    const suratJalan = await prisma.suratJalan.findMany({
      where,
      include: {
        items: {
          orderBy: {
            urutan: 'asc',
          },
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    })

    return NextResponse.json(suratJalan)
  } catch (error) {
    console.error('Error fetching surat jalan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch surat jalan' },
      { status: 500 }
    )
  }
}

// POST create new surat jalan
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdminAuth(request)
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { items, ...data } = body

    // Generate surat number (format: SJ/MMYYYY/001)
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    const monthYear = `${month}${year}`

    const lastSurat = await prisma.suratJalan.findFirst({
      where: {
        noSurat: {
          contains: monthYear,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    let sequence = 1
    if (lastSurat) {
      const lastSeq = parseInt(lastSurat.noSurat.split('/')[2])
      sequence = lastSeq + 1
    }

    const noSurat = `SJ/${monthYear}/${String(sequence).padStart(3, '0')}`

    // Create surat with items
    const surat = await prisma.suratJalan.create({
      data: {
        ...data,
        noSurat,
        tanggal: new Date(data.tanggal),
        createdBy: auth.email,
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
    console.error('Error creating surat jalan:', error)
    return NextResponse.json(
      { error: 'Failed to create surat jalan' },
      { status: 500 }
    )
  }
}
