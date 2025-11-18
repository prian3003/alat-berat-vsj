'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Plus, Trash2 } from 'lucide-react'

interface InvoiceItem {
  namaItem: string
  tanggal: string
  quantity: number
  harga: number
  diskon: number
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
  items: any[]
  keterangan?: string
  status: string
}

interface InvoiceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: Invoice
  onSuccess: () => void
}

export function InvoiceFormDialog({ open, onOpenChange, invoice, onSuccess }: InvoiceFormDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    customerName: '',
    customerLocation: '',
    pembayara: '',
    jatuhTempo: new Date().toISOString().split('T')[0],
    nomorPO: '',
    paymentMethod: 'transfer',
    bankName: 'BCA',
    accountNumber: '1801410397',
    accountName: 'YENI RETNAWATI',
    keterangan: '',
    status: 'draft',
    items: [{ namaItem: '', tanggal: new Date().toISOString().split('T')[0], quantity: 1, harga: 0, diskon: 0 }] as InvoiceItem[],
  })

  useEffect(() => {
    if (invoice) {
      setFormData({
        tanggal: invoice.tanggal.split('T')[0],
        customerName: invoice.customerName,
        customerLocation: invoice.customerLocation,
        pembayara: invoice.pembayara || '',
        jatuhTempo: invoice.jatuhTempo.split('T')[0],
        nomorPO: invoice.nomorPO || '',
        paymentMethod: invoice.paymentMethod || 'transfer',
        bankName: invoice.bankName || 'BCA',
        accountNumber: invoice.accountNumber || '1801410397',
        accountName: invoice.accountName || 'YENI RETNAWATI',
        keterangan: invoice.keterangan || '',
        status: invoice.status || 'draft',
        items: invoice.items.map((item) => ({
          namaItem: item.namaItem,
          tanggal: typeof item.tanggal === 'string' ? item.tanggal.split('T')[0] : new Date(item.tanggal).toISOString().split('T')[0],
          quantity: item.quantity,
          harga: Number(item.harga),
          diskon: Number(item.diskon),
        })),
      })
    } else {
      setFormData({
        tanggal: new Date().toISOString().split('T')[0],
        customerName: '',
        customerLocation: '',
        pembayara: '',
        jatuhTempo: new Date().toISOString().split('T')[0],
        nomorPO: '',
        paymentMethod: 'transfer',
        bankName: 'BCA',
        accountNumber: '1801410397',
        accountName: 'YENI RETNAWATI',
        keterangan: '',
        status: 'draft',
        items: [{ namaItem: '', tanggal: new Date().toISOString().split('T')[0], quantity: 1, harga: 0, diskon: 0 }],
      })
    }
  }, [invoice, open])

  const validateForm = (): string | null => {
    // Validate customer info
    if (!formData.customerName.trim()) {
      return 'Customer name is required'
    }
    if (formData.customerName.length > 255) {
      return 'Customer name must be less than 255 characters'
    }
    if (!formData.customerLocation.trim()) {
      return 'Customer location is required'
    }
    if (formData.customerLocation.length > 255) {
      return 'Customer location must be less than 255 characters'
    }

    // Validate dates
    const tanggal = new Date(formData.tanggal)
    const jatuhTempo = new Date(formData.jatuhTempo)

    if (jatuhTempo < tanggal) {
      return 'Due date (Jatuh Tempo) cannot be before invoice date'
    }

    // Validate items
    if (formData.items.length === 0) {
      return 'At least one item is required'
    }

    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i]

      if (!item.namaItem.trim()) {
        return `Item ${i + 1}: Item name is required`
      }
      if (item.namaItem.length > 255) {
        return `Item ${i + 1}: Item name must be less than 255 characters`
      }
      if (item.quantity <= 0) {
        return `Item ${i + 1}: Quantity must be greater than 0`
      }
      if (item.harga <= 0) {
        return `Item ${i + 1}: Price must be greater than 0`
      }
      if (item.diskon < 0) {
        return `Item ${i + 1}: Discount cannot be negative`
      }
      if (item.diskon > (item.harga * item.quantity)) {
        return `Item ${i + 1}: Discount cannot exceed total price`
      }
    }

    // Calculate total
    const total = formData.items.reduce((sum, item) => {
      return sum + (item.harga * item.quantity) - item.diskon
    }, 0)

    if (total <= 0) {
      return 'Invoice total must be greater than 0'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const validationError = validateForm()
    if (validationError) {
      toast({
        title: 'Validation Error',
        description: validationError,
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const url = invoice ? `/api/invoice/${invoice.id}` : '/api/invoice'
      const method = invoice ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Invoice ${invoice ? 'updated' : 'created'} successfully`,
        })
        onSuccess()
        onOpenChange(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save invoice')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : `Failed to ${invoice ? 'update' : 'create'} invoice`,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { namaItem: '', tanggal: new Date().toISOString().split('T')[0], quantity: 1, harga: 0, diskon: 0 }],
    })
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  // Format number with thousand separators
  const formatNumber = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value
    if (isNaN(num)) return ''
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Parse formatted number back to number
  const parseFormattedNumber = (value: string): number => {
    const num = parseFloat(value.replace(/\./g, ''))
    return isNaN(num) ? 0 : num
  }

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (item.harga * item.quantity)
    }, 0)

    const totalDiscount = formData.items.reduce((sum, item) => {
      return sum + item.diskon
    }, 0)

    const total = subtotal - totalDiscount

    return { subtotal, totalDiscount, total }
  }

  const { subtotal, totalDiscount, total } = calculateTotals()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] w-full max-w-none overflow-y-auto rounded-lg shadow-2xl" style={{maxWidth: '95vw'}}>
        <DialogHeader>
          <DialogTitle className="text-2xl">{invoice ? 'Edit Invoice' : 'Tambah Invoice Baru'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Jatuh Tempo <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.jatuhTempo}
                onChange={(e) => setFormData({ ...formData, jatuhTempo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.customerLocation}
                onChange={(e) => setFormData({ ...formData, customerLocation: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Pembayara
              </label>
              <input
                type="text"
                value={formData.pembayara}
                onChange={(e) => setFormData({ ...formData, pembayara: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nomor P.O <span className="text-xs text-slate-500">(Auto-generated)</span>
              </label>
              <input
                type="text"
                value={formData.nomorPO || 'Will be auto-generated'}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Items</h3>
              <Button type="button" onClick={addItem} size="sm" className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 bg-slate-50">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-slate-700">Item {index + 1}</span>
                    {formData.items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Nama Item <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={item.namaItem}
                        onChange={(e) => updateItem(index, 'namaItem', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Tanggal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={item.tanggal}
                        onChange={(e) => updateItem(index, 'tanggal', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Qty <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Harga <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formatNumber(item.harga)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\./g, '')
                          if (value === '' || /^\d+$/.test(value)) {
                            updateItem(index, 'harga', parseFormattedNumber(e.target.value))
                          }
                        }}
                        onFocus={(e) => {
                          if (item.harga === 0) {
                            e.target.value = ''
                            updateItem(index, 'harga', 0)
                          }
                        }}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Diskon
                      </label>
                      <input
                        type="text"
                        value={formatNumber(item.diskon)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\./g, '')
                          if (value === '' || /^\d+$/.test(value)) {
                            updateItem(index, 'diskon', parseFormattedNumber(e.target.value))
                          }
                        }}
                        onFocus={(e) => {
                          if (item.diskon === 0) {
                            e.target.value = ''
                            updateItem(index, 'diskon', 0)
                          }
                        }}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Invoice Summary</h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Discount:</span>
                <span className="font-medium text-red-600">-{formatCurrency(totalDiscount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
                <span>Total:</span>
                <span className={total <= 0 ? 'text-red-600' : 'text-green-600'}>{formatCurrency(total)}</span>
              </div>
              {total <= 0 && (
                <p className="text-xs text-red-600 mt-2">
                  Warning: Invoice total must be greater than 0
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Keterangan
            </label>
            <textarea
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700">
              {isSubmitting ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
