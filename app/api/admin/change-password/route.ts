import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken, getTokenFromCookies, hashPassword } from '@/lib/auth'

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

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { oldPassword, newPassword, confirmPassword } = body

    // Validate input
    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password minimal 8 karakter' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Password dan konfirmasi tidak cocok' },
        { status: 400 }
      )
    }

    if (oldPassword === newPassword) {
      return NextResponse.json(
        { error: 'Password baru harus berbeda dengan password lama' },
        { status: 400 }
      )
    }

    // Get admin user
    const admin = await prisma.adminUser.findUnique({
      where: { id: auth.userId }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin user tidak ditemukan' },
        { status: 404 }
      )
    }

    // Verify old password
    const hashedOldPassword = hashPassword(oldPassword)
    if (admin.password !== hashedOldPassword) {
      return NextResponse.json(
        { error: 'Password lama tidak sesuai' },
        { status: 401 }
      )
    }

    // Update password
    const hashedNewPassword = hashPassword(newPassword)
    await prisma.adminUser.update({
      where: { id: auth.userId },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah'
    })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Gagal mengubah password' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
