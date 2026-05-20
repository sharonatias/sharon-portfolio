import { NextRequest, NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase-public'

// GET single app case
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log('GET /api/app-cases/[id] - fetching id:', id)

    // Ensure id is a valid string and not undefined
    if (!id || id === 'undefined') {
      console.error('Invalid id:', id)
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const { data, error } = await supabasePublic
      .from('app_cases')
      .select('*')
      .eq('id', id)
      .single()

    console.log('GET /api/app-cases/[id] - response:', { data, error })

    if (error) {
      console.error('Supabase GET error:', error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('GET /api/app-cases/[id] error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// PUT update app case
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const { supabase } = await import('@/lib/supabase')

    // Ensure all sections have proper structure
    const sanitizeSection = (section: any) => {
      if (!section) return { title: '', description: '', images: [] }
      return {
        title: section.title || '',
        description: section.description || '',
        images: section.images || [],
      }
    }

    const { data, error } = await supabase
      .from('app_cases')
      .update({
        title: body.title,
        subtitle: body.subtitle,
        year: body.year,
        role: body.role,
        hero_image: body.hero_image,
        hero_description: body.hero_description,
        problem: sanitizeSection(body.problem),
        insight: sanitizeSection(body.insight),
        approach: sanitizeSection(body.approach),
        flow: sanitizeSection(body.flow),
        interaction: sanitizeSection(body.interaction),
        outcome: sanitizeSection(body.outcome),
        brand_color: body.brand_color,
        category: body.category || 'brand_digital_design',
        brand_design_id: body.brand_design_id || null,
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase PUT error:', error)
      throw error
    }

    return NextResponse.json(data[0])
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('PUT /api/app-cases/[id] error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// DELETE app case
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase } = await import('@/lib/supabase')
    const { error } = await supabase
      .from('app_cases')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase DELETE error:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('DELETE /api/app-cases/[id] error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
