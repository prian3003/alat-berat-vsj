'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'

interface InvoiceItem {
  urutan: number
  namaItem: string
  tanggal: string
  quantity: number
  harga: number
  diskon: number
  totalHarga: number
}

interface Invoice {
  id: string
  noFaktur: string
  tanggal: string
  customerName: string
  customerLocation: string
  pembayara?: string
  jatuhTempo: string
  nomorPO?: string
  paymentMethod: string
  bankName?: string
  accountNumber?: string
  accountName?: string
  subtotal: number
  totalDiscount: number
  total: number
  items: InvoiceItem[]
  keterangan?: string
  status: string
}

interface InvoicePreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: Invoice
}

export function InvoicePreviewModal({ open, onOpenChange, invoice }: InvoicePreviewModalProps) {
  if (!invoice) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] w-full max-w-none overflow-y-auto rounded-lg shadow-2xl" style={{maxWidth: '95vw'}}>
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>

        {/* Invoice Template */}
        <div className="bg-white p-6 border-3 border-slate-900">
          {/* Header */}
          <div className="flex justify-between items-start mb-3 pb-3 border-b-2 border-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-200 flex items-center justify-center">
                <Image src="/logo.png" alt="VSJ Logo" width={64} height={64} className="object-contain" />
              </div>
              <div style={{ fontSize: '10px' }}>
                <h1 className="text-sm font-bold">PT. VANIA SUGIARTA JAYA</h1>
                <p>Jl. Raya Denpasar No.16</p>
                <p>Mangwi - Badung</p>
                <p>No. HP : +62 813-2580-5326 | +62 822-3095-8088</p>
              </div>
            </div>
            <div className="text-right border-2 border-slate-900 p-2">
              <div style={{ fontSize: '9px' }} className="space-y-0.5">
                <div>
                  <span className="font-semibold">Customer</span>
                  <span className="ml-2">: {invoice.customerName}</span>
                </div>
                <div>
                  <span className="font-semibold">LOKASI</span>
                  <span className="ml-2">: {invoice.customerLocation}</span>
                </div>
                <div>
                  <span className="font-semibold">Pembayara</span>
                  <span className="ml-2">: {invoice.pembayara || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold">Jatuh Tempo</span>
                  <span className="ml-2">: {formatDate(invoice.jatuhTempo)}</span>
                </div>
                <div>
                  <span className="font-semibold">Nomor P.O</span>
                  <span className="ml-2">: {invoice.nomorPO || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Date and Number */}
          <div className="mb-2" style={{ fontSize: '10px' }}>
            <div>Tanggal: {formatDate(invoice.tanggal)}</div>
            <div>No. Faktur: {invoice.noFaktur}</div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center mb-3">TAGIHAN</h2>

          {/* Items Table */}
          <table className="w-full border-2 border-slate-900 mb-3">
            <thead>
              <tr className="bg-slate-100">
                <th className="border-2 border-slate-900 px-1.5 py-1" style={{ fontSize: '10px', width: '6%' }}>No.</th>
                <th className="border-2 border-slate-900 px-1.5 py-1" style={{ fontSize: '10px' }}>Nama Item</th>
                <th className="border-2 border-slate-900 px-1.5 py-1 text-center" style={{ fontSize: '10px', width: '12%' }}>Tanggal</th>
                <th className="border-2 border-slate-900 px-1.5 py-1 text-center" style={{ fontSize: '10px', width: '8%' }}>Qty</th>
                <th className="border-2 border-slate-900 px-1.5 py-1 text-right" style={{ fontSize: '10px', width: '15%' }}>Harga</th>
                <th className="border-2 border-slate-900 px-1.5 py-1 text-right" style={{ fontSize: '10px', width: '12%' }}>Diskon</th>
                <th className="border-2 border-slate-900 px-1.5 py-1 text-right" style={{ fontSize: '10px', width: '17%' }}>Total Harga</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="border-2 border-slate-900 px-1.5 py-1" style={{ fontSize: '10px' }}>{item.urutan}</td>
                  <td className="border-2 border-slate-900 px-1.5 py-1" style={{ fontSize: '10px' }}>{item.namaItem}</td>
                  <td className="border-2 border-slate-900 px-1.5 py-1 text-center" style={{ fontSize: '10px' }}>{formatDate(item.tanggal)}</td>
                  <td className="border-2 border-slate-900 px-1.5 py-1 text-center" style={{ fontSize: '10px' }}>{item.quantity}</td>
                  <td className="border-2 border-slate-900 px-1.5 py-1 text-right" style={{ fontSize: '10px' }}>
                    {formatCurrency(Number(item.harga))}
                  </td>
                  <td className="border-2 border-slate-900 px-1.5 py-1 text-right" style={{ fontSize: '10px' }}>
                    {formatCurrency(Number(item.diskon))}
                  </td>
                  <td className="border-2 border-slate-900 px-1.5 py-1 text-right" style={{ fontSize: '10px' }}>
                    Rp {formatCurrency(Number(item.totalHarga))}
                  </td>
                </tr>
              ))}
              {/* Date and Total Row */}
              <tr>
                <td colSpan={3} className="border-2 border-slate-900 px-1.5 py-1" style={{ fontSize: '10px' }}>
                  Dicetak pada tanggal: {formatDate(invoice.tanggal)}
                </td>
                <td colSpan={2} className="border-2 border-slate-900 px-1.5 py-1 text-right font-bold" style={{ fontSize: '10px' }}>
                  admin :
                </td>
                <td className="border-2 border-slate-900 px-1.5 py-1 text-right font-bold" style={{ fontSize: '10px' }}>JUMLAH</td>
                <td className="border-2 border-slate-900 px-1.5 py-1 text-right font-bold" style={{ fontSize: '10px' }}>
                  Rp {formatCurrency(Number(invoice.total))}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Payment Info */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="border-2 border-slate-900 p-4">
              <div className="mb-2">
                <span className="font-bold">Penerima</span>
                <span className="ml-16">Hormat kami</span>
              </div>
              <div className="h-16"></div>
              <div className="border-b-2 border-dotted border-slate-900 w-32 inline-block"></div>
              <span className="ml-12">
                <div className="border-b-2 border-dotted border-slate-900 w-32 inline-block"></div>
              </span>
            </div>
            <div className="border-2 border-slate-900 p-4">
              <div className="text-sm space-y-1">
                <div className="font-bold">Transfer ke:</div>
                <div>Bank {invoice.bankName || 'BCA'}</div>
                <div>No Rek : {invoice.accountNumber || '1801410397'}</div>
                <div>an. {invoice.accountName || 'YENI RETNAWATI'}</div>
              </div>
              <div className="mt-4 border-2 border-slate-900 p-2 text-right">
                <div className="font-bold text-sm">Rp -</div>
              </div>
              <div className="mt-2 border-2 border-slate-900 p-2 text-right">
                <div className="font-bold text-sm">TOTAL Rp {formatCurrency(Number(invoice.total))}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
