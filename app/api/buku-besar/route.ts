import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromCookies } from '@/lib/auth'

// Create Supabase admin client
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

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookies(request.cookies)
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('buku_besar')
      .select('*')
      .order('tanggal', { ascending: true })

    if (error) {
      console.error('Buku Besar GET error:', error)
      throw error
    }

    // Calculate running balance
    let saldo = 0
    const entriesWithBalance = (data || []).map((entry: any) => {
      const debit = entry.debit || 0
      const kredit = entry.kredit || 0
      saldo = saldo + debit - kredit
      return {
        ...entry,
        saldo_akhir: saldo
      }
    })

    return NextResponse.json(entriesWithBalance)
  } catch (error) {
    console.error('Buku Besar fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buku besar' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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
      .insert([bukuBesarData])
      .select()

    if (error) {
      console.error('Supabase INSERT error:', error)
      console.error('Attempted data:', bukuBesarData)
      throw error
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Buku Besar POST error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create buku besar entry'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
