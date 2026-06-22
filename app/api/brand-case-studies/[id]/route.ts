import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const revalidate = 0 // No caching - always fetch fresh data

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('brand_case_studies')
      .select('*')
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Brand case study not found' }, { status: 404 })
    }

    const caseStudy = data[0]
    return NextResponse.json(caseStudy, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0'
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to fetch brand case study' }, { status: 500 })
  }
}

const updateBrandCaseStudy = async (request: Request, params: Promise<{ id: string }>) => {
  try {
    const { id } = await params
    const body = await request.json()

    const { data, error } = await supabase
      .from('brand_case_studies')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to update brand case study' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return updateBrandCaseStudy(request, params)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return updateBrandCaseStudy(request, params)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('brand_case_studies')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to delete brand case study' }, { status: 500 })
  }
}
