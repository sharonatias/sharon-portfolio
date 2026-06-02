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

    // Ensure all sections have proper structure, preserving label and accentColor
    const sanitizeSection = (section: any) => {
      if (!section) return { title: '', description: '', images: [], label: undefined, accentColor: undefined }
      return {
        title: section.title || '',
        description: section.description || '',
        images: section.images || [],
        label: section.label || undefined,
        accentColor: section.accentColor || undefined,
      }
    }

    const updateData: any = {
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
    }

    // Add optional fields if they are provided
    if (body.client) updateData.client = body.client
    if (body.duration) updateData.duration = body.duration
    if (body.format) updateData.format = body.format
    if (body.watch_film_link) updateData.watch_film_link = body.watch_film_link
    if (body.video_file) updateData.video_file = body.video_file
    if (body.gallery_images && body.gallery_images.length > 0) updateData.gallery_images = body.gallery_images
    if (body.process_blocks && body.process_blocks.length > 0) updateData.process_blocks = body.process_blocks
    if (body.my_role_title) updateData.my_role_title = body.my_role_title
    if (body.my_role_description) updateData.my_role_description = body.my_role_description
    if (body.custom_sections && body.custom_sections.length > 0) updateData.custom_sections = body.custom_sections

    const { data, error } = await supabase
      .from('app_cases')
      .update(updateData)
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
