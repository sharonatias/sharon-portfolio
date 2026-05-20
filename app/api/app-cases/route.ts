import { NextRequest, NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase-public'
import { AppCase } from '@/lib/types'

// GET all app cases
export async function GET() {
  try {
    const { data, error } = await supabasePublic
      .from('app_cases')
      .select('*')
      .order('display_order', { ascending: true, nullsFirst: true })

    if (error) {
      console.error('Supabase GET error:', error)
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('GET /api/app-cases error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST create app case
export async function POST(request: NextRequest) {
  try {
    const body: AppCase = await request.json()
    console.log('POST /api/app-cases - Received body:', body)

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

    const insertData = {
      title: body.title,
      subtitle: body.subtitle,
      year: body.year || new Date().getFullYear().toString(),
      role: body.role,
      hero_image: body.hero_image,
      hero_description: body.hero_description,
      problem: sanitizeSection(body.problem),
      insight: sanitizeSection(body.insight),
      approach: sanitizeSection(body.approach),
      flow: sanitizeSection(body.flow),
      interaction: sanitizeSection(body.interaction),
      outcome: sanitizeSection(body.outcome),
      brand_color: body.brand_color || '#000000',
      category: body.category || 'brand_digital_design',
      brand_design_id: body.brand_design_id || null,
    }

    console.log('POST /api/app-cases - Insert data:', insertData)

    const { data, error } = await supabase
      .from('app_cases')
      .insert([insertData])
      .select()

    console.log('POST /api/app-cases - Supabase response:', { data, error })

    if (error) {
      console.error('Supabase POST error:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.error('No data returned from insert')
      return NextResponse.json({ error: 'No data returned from insert' }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('POST /api/app-cases error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// PATCH update order
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { supabase } = await import('@/lib/supabase')

    const updates = body.cases.map((appCase: any) => ({
      id: appCase.id,
      display_order: appCase.order,
    }))

    for (const update of updates) {
      const { error } = await supabase
        .from('app_cases')
        .update({ display_order: update.display_order })
        .eq('id', update.id)

      if (error) {
        console.error('Supabase PATCH error:', error)
        throw error
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('PATCH /api/app-cases error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
