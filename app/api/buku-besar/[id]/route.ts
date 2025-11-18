import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromCookies } from '@/lib/auth'

const getSupabaseAdmin = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = getTokenFromCookies(request.cookies)
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()
    const body = await request.json()

    const bukuBesarData = {
      nomor: body.nomor,
      tanggal: body.tanggal,
      deskripsi: body.deskripsi,
      debit: body.debit || 0,
      kredit: body.kredit || 0,
      keterangan: body.keterangan || null
    }

    const { data, error } = await supabase
      .from('buku_besar')
      .update(bukuBesarData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase UPDATE error:', error)
      throw error
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Buku Besar PUT error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update buku besar entry'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = getTokenFromCookies(request.cookies)
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from('buku_besar')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase DELETE error:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Buku Besar DELETE error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete buku besar entry'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
