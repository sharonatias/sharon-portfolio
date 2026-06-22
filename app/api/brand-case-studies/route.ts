import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const revalidate = 0 // No caching - always fetch fresh data

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('brand_case_studies')
      .select('*')
      .order('year', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0'
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to fetch brand case studies' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('brand_case_studies')
      .insert([body])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data?.[0], { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to create brand case study' }, { status: 500 })
  }
}
