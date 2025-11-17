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

// GET single surat perjanjian by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const agreement = await prisma.suratPerjanjian.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: {
            urutan: 'asc',
          },
        },
      },
    })

    if (!agreement) {
      return NextResponse.json(
        { error: 'Surat perjanjian not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(agreement)
  } catch (error) {
    console.error('Error fetching surat perjanjian:', error)
    return NextResponse.json(
      { error: 'Failed to fetch surat perjanjian' },
      { status: 500 }
    )
  }
}

// PUT update surat perjanjian by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const auth = await verifyAdminAuth(request)
  if (!auth) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
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
      status,
    } = body

    // Delete existing items
    await prisma.suratPerjanjianItem.deleteMany({
      where: { suratPerjanjianId: id },
    })

    // Update surat perjanjian with new items
    const agreement = await prisma.suratPerjanjian.update({
      where: { id },
      data: {
        tanggal: tanggal ? new Date(tanggal) : undefined,
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
        tanggalMulai: tanggalMulai ? new Date(tanggalMulai) : undefined,
        tanggalSelesai: tanggalSelesai ? new Date(tanggalSelesai) : undefined,
        keterangan,
        status,
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

    return NextResponse.json(agreement)
  } catch (error) {
    console.error('Error updating surat perjanjian:', error)
    return NextResponse.json(
      { error: 'Failed to update surat perjanjian' },
      { status: 500 }
    )
  }
}

// DELETE surat perjanjian by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const auth = await verifyAdminAuth(request)
  if (!auth) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params

    await prisma.suratPerjanjian.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting surat perjanjian:', error)
    return NextResponse.json(
      { error: 'Failed to delete surat perjanjian' },
      { status: 500 }
    )
  }
}
