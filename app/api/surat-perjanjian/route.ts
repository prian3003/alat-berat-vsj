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

// Helper function to generate auto-incrementing agreement number
async function generateNoPerjanjian() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const monthYear = `${month}${year}`

  // Count agreements from current month
  const startOfMonth = new Date(year, now.getMonth(), 1)
  const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59)

  const count = await prisma.suratPerjanjian.count({
    where: {
      tanggal: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  })

  const sequence = String(count + 1).padStart(3, '0')
  return `SP/${monthYear}/VSJ/${sequence}`
}

// GET all surat perjanjian with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    let where: any = {}

    if (status) {
      where.status = status
    }

    if (month && year) {
      const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endOfMonth = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
      where.tanggal = {
        gte: startOfMonth,
        lte: endOfMonth,
      }
    }

    const agreements = await prisma.suratPerjanjian.findMany({
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

    return NextResponse.json(agreements)
  } catch (error) {
    console.error('Error fetching surat perjanjian:', error)
    return NextResponse.json(
      { error: 'Failed to fetch surat perjanjian' },
      { status: 500 }
    )
  }
}

// POST create new surat perjanjian
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
    const {
      tanggal,
      tanggalPernyataan,
      pihakPertamaNama,
      pihakPertamaJabatan,
      pihakPertamaPerusahaan,
      pihakPertamaAlamat,
      pihakKeduaNama,
      pihakKeduaJabatan,
      pihakKedualPerusahaan,
      pihakKeduaAlamat,
      lokasiPekerjaan,
      tanggalMulai,
      tanggalSelesai,
      items,
      keterangan,
    } = body

    // Generate unique agreement number
    const noPerjanjian = await generateNoPerjanjian()

    // Create surat perjanjian with items
    const agreement = await prisma.suratPerjanjian.create({
      data: {
        noPerjanjian,
        tanggal: new Date(tanggal),
        tanggalPernyataan,
        pihakPertamaNama,
        pihakPertamaJabatan,
        pihakPertamaPerusahaan,
        pihakPertamaAlamat,
        pihakKeduaNama,
        pihakKeduaJabatan,
        pihakKedualPerusahaan,
        pihakKeduaAlamat,
        lokasiPekerjaan,
        tanggalMulai: new Date(tanggalMulai),
        tanggalSelesai: new Date(tanggalSelesai),
        keterangan,
        createdBy: auth.email,
        items: items?.length
          ? {
              create: items.map(
                (item: {
                  jenisAlat: string
                  jumlah: number
                  hargaSewa: string
                  keterangan?: string
                }, index: number) => ({
                  urutan: index + 1,
                  jenisAlat: item.jenisAlat,
                  jumlah: item.jumlah,
                  hargaSewa: item.hargaSewa,
                  keterangan: item.keterangan,
                })
              ),
            }
          : undefined,
      },
      include: {
        items: {
          orderBy: {
            urutan: 'asc',
          },
        },
      },
    })

    return NextResponse.json(agreement, { status: 201 })
  } catch (error) {
    console.error('Error creating surat perjanjian:', error)
    return NextResponse.json(
      { error: 'Failed to create surat perjanjian' },
      { status: 500 }
    )
  }
}
