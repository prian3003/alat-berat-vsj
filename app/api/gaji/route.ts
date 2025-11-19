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

// GET all salary records with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipe = searchParams.get('tipe') // weekly or monthly
    const status = searchParams.get('status')
    const bulan = searchParams.get('bulan')
    const tahun = searchParams.get('tahun')

    // Build where clause
    let where: any = {}

    if (tipe) {
      where.tipe = tipe
    }

    if (status) {
      where.status = status
    }

    if (bulan) {
      where.bulan = parseInt(bulan)
    }

    if (tahun) {
      where.tahun = parseInt(tahun)
    }

    const gaji = await prisma.gaji.findMany({
      where,
      include: {
        items: {
          orderBy: {
            urutan: 'asc',
          },
        },
        pekerjas: true,
      },
      orderBy: {
        tanggalMulai: 'desc',
      },
    })

    return NextResponse.json(gaji)
  } catch (error) {
    console.error('Error fetching salary records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch salary records' },
      { status: 500 }
    )
  }
}

// POST create new salary record
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdminAuth(request)
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { items, pekerjas, ...data } = body

    // Generate salary number (format: YYYYMMDD-XXXXXX)
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')

    // Get last salary record of the day
    const startOfDay = new Date(now.setHours(0, 0, 0, 0))
    const endOfDay = new Date(now.setHours(23, 59, 59, 999))

    const lastGaji = await prisma.gaji.findFirst({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    let sequence = 1
    if (lastGaji) {
      const lastSeq = parseInt(lastGaji.nomorGaji.split('-')[1])
      sequence = lastSeq + 1
    }

    const nomorGaji = `${dateStr}-${String(sequence).padStart(6, '0')}`

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

    // Process pekerjas data
    const pekerjaData = pekerjas?.map((pekerja: any) => ({
      pekerjaNama: pekerja.pekerjaNama,
      pekerjaId: pekerja.pekerjaId || null,
      jabatan: pekerja.jabatan,
    })) || []

    // Process deductions
    const bonAmount = data.bonAmount ? parseFloat(data.bonAmount) : 0
    const uangMakanAmount = data.uangMakanAmount ? parseFloat(data.uangMakanAmount) : 0
    const totalPotongan = bonAmount + uangMakanAmount
    const gajiNetto = totalGaji - totalPotongan

    // Create salary record with items, workers, and deductions
    const gaji = await prisma.gaji.create({
      data: {
        nomorGaji,
        tipe: data.tipe,
        bulan: data.bulan ? parseInt(data.bulan) : null,
        tahun: data.tahun ? parseInt(data.tahun) : null,
        tanggalMulai: new Date(data.tanggalMulai),
        tanggalSelesai: new Date(data.tanggalSelesai),
        totalGaji,
        bonAmount,
        uangMakanAmount,
        totalPotongan,
        gajiNetto,
        keterangan: data.keterangan || null,
        status: data.status || 'draft',
        createdBy: auth.email,
        items: {
          create: itemsData,
        },
        pekerjas: {
          create: pekerjaData,
        },
      },
      include: {
        items: true,
        pekerjas: true,
      },
    })

    return NextResponse.json(gaji)
  } catch (error) {
    console.error('Error creating salary record:', error)
    return NextResponse.json(
      { error: 'Failed to create salary record' },
      { status: 500 }
    )
  }
}
