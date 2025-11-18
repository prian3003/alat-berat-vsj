'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { InvoiceFormDialog } from '@/components/invoice/invoice-form-dialog'
import { InvoicePreviewModal } from '@/components/invoice/invoice-preview-modal'
import { InvoiceTemplate } from '@/components/invoice/invoice-template'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Eye, Edit2, Trash2, Download } from 'lucide-react'

interface InvoiceItem {
  urutan: number
  namaItem: string
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
  createdBy?: string
  createdAt: string
}

export default function InvoicePage() {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const { toast } = useToast()

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | undefined>()
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [pdfInvoice, setPdfInvoice] = useState<Invoice | undefined>()
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false)

  // Robust search function
  const filteredInvoices = invoices.filter((invoice) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true

    return (
      invoice.noFaktur.toLowerCase().includes(query) ||
      invoice.customerName.toLowerCase().includes(query) ||
      invoice.customerLocation.toLowerCase().includes(query) ||
      invoice.nomorPO?.toLowerCase().includes(query) ||
      new Date(invoice.tanggal).toLocaleDateString('id-ID').includes(query)
    )
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const loadInvoices = async () => {
    try {
      setIsLoadingInvoices(true)
      const response = await fetch('/api/invoice')
      if (response.ok) {
        const data = await response.json()
        setInvoices(data)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load invoices',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingInvoices(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadInvoices()
    }
  }, [isAuthenticated])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleAddInvoice = () => {
    setSelectedInvoice(undefined)
    setIsFormDialogOpen(true)
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsFormDialogOpen(true)
  }

  const handleDeleteClick = (invoice: Invoice) => {
    setInvoiceToDelete(invoice)
    setDeleteAlertOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/invoice/${invoiceToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Invoice deleted successfully',
        })
        loadInvoices()
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete invoice',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
      setDeleteAlertOpen(false)
      setInvoiceToDelete(null)
    }
  }

  const handlePreview = (invoice: Invoice) => {
    setPreviewInvoice(invoice)
    setIsPreviewOpen(true)
  }

  const handleDownloadPDF = (invoice: Invoice) => {
    setPdfInvoice(invoice)
    setIsPdfDialogOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster />

      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-600">Kelola alat berat dan konten website</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/">Kembali ke Website</Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-4 border-b">
            <Link
              href="/admin"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Alat Berat
            </Link>
            <Link
              href="/admin/blog"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Blog
            </Link>
            <Link
              href="/admin/gallery"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Galeri
            </Link>
            <Link
              href="/admin/surat"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Surat Jalan
            </Link>
            <Link
              href="/admin/perjanjian"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Surat Perjanjian Sewa
            </Link>
            <Link
              href="/admin/buku-besar"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Buku Besar
            </Link>
            <Link
              href="/admin/invoice"
              className="border-b-2 border-orange-600 px-4 py-3 text-sm font-medium text-orange-600"
            >
              Invoice
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by invoice number, customer, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <Button onClick={handleAddInvoice} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    No. Faktur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Jatuh Tempo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {isLoadingInvoices ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      Loading invoices...
                    </td>
                  </tr>
                ) : paginatedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-slate-500">
                      {searchQuery ? 'No invoices found matching your search' : 'No invoices yet'}
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {invoice.noFaktur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(invoice.tanggal).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        <div>{invoice.customerName}</div>
                        <div className="text-slate-500 text-xs">{invoice.customerLocation}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(invoice.jatuhTempo).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {formatCurrency(Number(invoice.total))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          invoice.status === 'draft' ? 'bg-slate-100 text-slate-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPDF(invoice)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditInvoice(invoice)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(invoice)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredInvoices.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredInvoices.length}</span> results
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      size="sm"
                      className={currentPage === i + 1 ? 'bg-orange-600 hover:bg-orange-700' : ''}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Dialog */}
      <InvoiceFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        invoice={selectedInvoice}
        onSuccess={loadInvoices}
      />

      {/* Preview Modal */}
      <InvoicePreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        invoice={previewInvoice}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete invoice {invoiceToDelete?.noFaktur}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* PDF Download Dialog */}
      <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
        <DialogContent className="max-h-[95vh] w-full max-w-none overflow-y-auto rounded-lg shadow-2xl" style={{maxWidth: '95vw'}}>
          <DialogHeader>
            <DialogTitle>Download Invoice PDF</DialogTitle>
          </DialogHeader>
          {pdfInvoice && <InvoiceTemplate invoice={pdfInvoice} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
