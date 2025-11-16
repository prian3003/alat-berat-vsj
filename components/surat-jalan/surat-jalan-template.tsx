'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'

let html2pdf: any = null

interface SuratJalanItem {
  urutan: number
  jenisUnit: string
  seri: string
  lokasi: string
  keterangan?: string
}

interface SuratJalanTemplateProps {
  noSurat: string
  tanggal: string
  jenisKendaraan: string
  noPol: string
  sopir: string
  items: SuratJalanItem[]
  tujuan?: string
  keterangan?: string
}

export function SuratJalanTemplate({
  noSurat,
  tanggal,
  jenisKendaraan,
  noPol,
  sopir,
  items,
  tujuan,
  keterangan,
}: SuratJalanTemplateProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (printRef.current) {
      window.print()
    }
  }

  const handleDownloadPDF = async () => {
    if (!printRef.current) return

    try {
      // Dynamically load html2pdf only when needed
      if (!html2pdf) {
        html2pdf = (await import('html2pdf.js')).default
      }

      const element = printRef.current
      const options = {
        margin: 10,
        filename: `${noSurat}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      }

      html2pdf().set(options).from(element).save()
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Gagal mengunduh PDF')
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="w-full">
      {/* Buttons */}
      <div className="mb-4 flex gap-2 print:hidden">
        <Button onClick={handlePrint} variant="outline" size="sm">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"
            />
          </svg>
          Cetak
        </Button>
        <Button onClick={handleDownloadPDF} variant="outline" size="sm">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF
        </Button>
      </div>

      {/* Document */}
      <div
        ref={printRef}
        className="mx-auto w-full max-w-4xl bg-white p-8"
        style={{ fontSize: '11px', lineHeight: 1.6 }}
      >
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-300">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="VSJ Logo"
                width={100}
                height={80}
                className="h-20 w-auto"
              />
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h1 className="text-center text-xl font-bold leading-tight">
                PT. VANIA SUGIARTA JAYA
              </h1>
              <p className="text-center text-sm font-semibold text-gray-700 mt-1">
                Sewa Alat Berat Terpercaya
              </p>
              <p className="text-center text-xs text-gray-600 mt-3 space-y-1">
                <span className="block">Jln. Werdi Bhuwana, Kec. Mengwi, Kab. Badung-Bali, 80351</span>
                <span className="block">Telp. (+62) 821-3965-9136 | Email: info@vaniasugiarta.com</span>
                <span className="block">www.vaniasugiarta.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Document Title */}
        <h2 className="mb-8 text-center text-lg font-bold border-b-2 border-black pb-2">
          SURAT JALAN
        </h2>

        {/* Document Info */}
        <div className="mb-6 grid grid-cols-2 gap-6 text-xs">
          <div className="flex justify-between items-center border-b border-black pb-1">
            <span className="font-bold">Jenis Kendaraan:</span>
            <span>{jenisKendaraan}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-1">
            <span className="font-bold">Tanggal:</span>
            <span>{formatDate(tanggal)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-1">
            <span className="font-bold">No Pol:</span>
            <span>{noPol}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-1">
            <span className="font-bold">Sopir:</span>
            <span>{sopir}</span>
          </div>
        </div>

        {/* Surat Number */}
        <div className="mb-6 text-center text-sm font-bold bg-gray-100 py-2 rounded">
          No. Surat: <span className="text-base">{noSurat}</span>
        </div>

        {/* Items Table */}
        <table className="mb-8 w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-800 px-3 py-2 text-center font-bold w-8">NO</th>
              <th className="border border-gray-800 px-3 py-2 text-left font-bold">JENIS UNIT</th>
              <th className="border border-gray-800 px-3 py-2 text-left font-bold">SERI</th>
              <th className="border border-gray-800 px-3 py-2 text-left font-bold">LOKASI</th>
              <th className="border border-gray-800 px-3 py-2 text-left font-bold">KETERANGAN</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.urutan} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  {item.urutan}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {item.jenisUnit}
                </td>
                <td className="border border-gray-300 px-3 py-2">{item.seri}</td>
                <td className="border border-gray-300 px-3 py-2">
                  {item.lokasi}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {item.keterangan || '-'}
                </td>
              </tr>
            ))}
            {/* Empty rows up to 6 */}
            {Array.from({
              length: Math.max(0, 6 - items.length),
            }).map((_, idx) => (
              <tr
                key={`empty-${idx}`}
                className={(items.length + idx) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="border border-gray-300 px-3 py-2 text-center">
                  {items.length + idx + 1}
                </td>
                <td className="border border-gray-300 px-3 py-2">&nbsp;</td>
                <td className="border border-gray-300 px-3 py-2">&nbsp;</td>
                <td className="border border-gray-300 px-3 py-2">&nbsp;</td>
                <td className="border border-gray-300 px-3 py-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Notes Section */}
        <div className="mb-8 text-xs border-l-4 border-gray-400 pl-3 py-2 bg-gray-50">
          <p className="font-bold mb-1">Keterangan:</p>
          <p className="mb-1">Mohon untuk dicek dan diterima oleh pihak yang berwenang</p>
          {tujuan && <p className="mb-1"><span className="font-bold">Tujuan:</span> {tujuan}</p>}
          {keterangan && <p><span className="font-bold">Catatan:</span> {keterangan}</p>}
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <p className="font-bold mb-16">PENGEMUDI</p>
            <div className="border-t-2 border-black pt-1 h-12 mb-1"></div>
            <p className="text-xs">Tanda Tangan</p>
            <p className="text-xs mt-3">Tanggal: ..................</p>
          </div>

          <div>
            <p className="font-bold mb-16">PERUSAHAAN</p>
            <div className="border-t-2 border-black pt-1 h-12 mb-1"></div>
            <p className="text-xs">Tanda Tangan</p>
            <p className="text-xs mt-3">Tanggal: ..................</p>
          </div>

          <div>
            <p className="font-bold mb-16">PENERIMA</p>
            <div className="border-t-2 border-black pt-1 h-12 mb-1"></div>
            <p className="text-xs">Tanda Tangan</p>
            <p className="text-xs mt-3">Tanggal: ..................</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-600">
          <p className="font-semibold">PT. VANIA SUGIARTA JAYA</p>
          <p>Jln. Werdi Bhuwana, Kec. Mengwi, Kab. Badung-Bali, 80351</p>
          <p>Telp. (+62) 821-3965-9136 | www.vaniasugiarta.com</p>
        </div>
      </div>
    </div>
  )
}
