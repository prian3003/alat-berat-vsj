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

// GET all invoices with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const customer = searchParams.get('customer')

    // Build where clause
    let where: any = {}

    if (status) {
      where.status = status
    }

    if (customer) {
      where.customerName = {
        contains: customer,
        mode: 'insensitive',
      }
    }

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0)
      where.tanggal = {
        gte: startDate,
        lte: endDate,
      }
    }

    const invoices = await prisma.invoice.findMany({
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

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

// POST create new invoice
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdminAuth(request)
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { items, ...data } = body

    // Generate invoice number (format: YYYYMMDD-XXXXXX)
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')

    // Get last invoice of the day
    const startOfDay = new Date(now.setHours(0, 0, 0, 0))
    const endOfDay = new Date(now.setHours(23, 59, 59, 999))

    const lastInvoice = await prisma.invoice.findFirst({
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
    if (lastInvoice) {
      const lastSeq = parseInt(lastInvoice.noFaktur.split('-')[1])
      sequence = lastSeq + 1
    }

    const noFaktur = `${dateStr}-${String(sequence).padStart(6, '0')}`

    // Generate Nomor PO if not provided (format: YYYY-XXXXX)
    let nomorPO = data.nomorPO
    if (!nomorPO || nomorPO.trim() === '') {
      const year = now.getFullYear()
      const lastPO = await prisma.invoice.findFirst({
        where: {
          nomorPO: {
            startsWith: `${year}-`,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      let poSequence = 1
      if (lastPO && lastPO.nomorPO) {
        const lastSeq = parseInt(lastPO.nomorPO.replace(`${year}-`, ''))
        if (!isNaN(lastSeq)) {
          poSequence = lastSeq + 1
        }
      }

      nomorPO = `${year}-${String(poSequence).padStart(5, '0')}`
    }

    // Calculate totals
    const itemsData = items.map((item: any, idx: number) => {
      const totalHarga = (item.harga * item.quantity) - (item.diskon || 0)
      return {
        urutan: idx + 1,
        namaItem: item.namaItem,
        tanggal: new Date(item.tanggal),
        quantity: item.quantity,
        harga: item.harga,
        diskon: item.diskon || 0,
        totalHarga,
      }
    })

    const subtotal = itemsData.reduce((sum: number, item: any) => sum + (item.harga * item.quantity), 0)
    const totalDiscount = itemsData.reduce((sum: number, item: any) => sum + item.diskon, 0)
    const total = subtotal - totalDiscount

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        noFaktur,
        tanggal: new Date(data.tanggal),
        customerName: data.customerName,
        customerLocation: data.customerLocation,
        pembayara: data.pembayara || null,
        jatuhTempo: new Date(data.jatuhTempo),
        nomorPO: nomorPO,
        paymentMethod: data.paymentMethod || 'transfer',
        bankName: data.bankName || null,
        accountNumber: data.accountNumber || null,
        accountName: data.accountName || null,
        subtotal,
        totalDiscount,
        total,
        keterangan: data.keterangan || null,
        status: data.status || 'draft',
        createdBy: auth.email,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
