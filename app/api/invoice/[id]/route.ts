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

// GET single invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: {
            urutan: 'asc',
          },
        },
      },
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    )
  }
}

// PUT update invoice
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

    // Delete existing items
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id },
    })

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

    // Update invoice with new items
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        tanggal: new Date(data.tanggal),
        customerName: data.customerName,
        customerLocation: data.customerLocation,
        pembayara: data.pembayara || null,
        jatuhTempo: new Date(data.jatuhTempo),
        nomorPO: data.nomorPO || null,
        paymentMethod: data.paymentMethod || 'transfer',
        bankName: data.bankName || null,
        accountNumber: data.accountNumber || null,
        accountName: data.accountName || null,
        subtotal,
        totalDiscount,
        total,
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

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    )
  }
}

// DELETE invoice
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
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id },
    })

    // Then delete invoice
    await prisma.invoice.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    )
  }
}
