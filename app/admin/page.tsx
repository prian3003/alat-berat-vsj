'use client'

import { useState } from 'react'
import { useEquipment } from '@/hooks/use-equipment'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EquipmentTable } from '@/components/dashboard/equipment-table'
import { EquipmentForm } from '@/components/dashboard/equipment-form'
import { ChangePasswordDialog } from '@/components/admin/change-password-dialog'
import { HeavyEquipmentWithImages } from '@/types'
import Link from 'next/link'
import { Toaster } from '@/components/ui/toaster'

export default function AdminPage() {
  const { equipment, loading, refetch } = useEquipment()
  const { isAuthenticated, isLoading, logout, user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<HeavyEquipmentWithImages | undefined>(undefined)

  const handleAdd = () => {
    setSelectedEquipment(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (equipment: HeavyEquipmentWithImages) => {
    setSelectedEquipment(equipment)
    setIsDialogOpen(true)
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setSelectedEquipment(undefined)
    refetch()
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setSelectedEquipment(undefined)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Memeriksa autentikasi...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
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
              <Button variant="outline" onClick={() => setIsChangePasswordOpen(true)}>
                Ubah Password
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
              className="border-b-2 border-orange-600 px-4 py-3 text-sm font-medium text-orange-600"
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
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Invoice
            </Link>
            <Link
              href="/admin/gaji"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Gaji
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Daftar Alat Berat</h2>
            <p className="text-sm text-slate-600">
              Total: {equipment.length} alat berat
            </p>
          </div>
          <Button onClick={handleAdd}>
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Alat Berat
          </Button>
        </div>

        {loading ? (
          <div className="rounded-lg border bg-white p-12 text-center">
            <p className="text-slate-600">Memuat data...</p>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <EquipmentTable
              equipment={equipment}
              onEdit={handleEdit}
              onRefresh={refetch}
            />
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEquipment ? 'Edit Alat Berat' : 'Tambah Alat Berat Baru'}
            </DialogTitle>
          </DialogHeader>
          <EquipmentForm
            equipment={selectedEquipment}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      <Toaster />
    </div>
  )
}
