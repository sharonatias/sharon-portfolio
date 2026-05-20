import { NextRequest, NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase-public'
import { Project } from '@/lib/types'

// GET all projects
export async function GET() {
  try {
    const { data, error } = await supabasePublic
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true, nullsFirst: true })

    if (error) {
      console.error('Supabase GET error:', error)
      throw error
    }

    // Convert snake_case to camelCase for textStyles
    const formattedData = (data || []).map((item: any) => ({
      ...item,
      textStyles: item.text_styles || undefined,
    }))

    return NextResponse.json(formattedData)
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('GET /api/projects error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST create project
export async function POST(request: NextRequest) {
  try {
    const body: Project = await request.json()

    const { supabase } = await import('@/lib/supabase')
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title: body.title,
        description: body.description,
        category: body.category,
        image_url: body.image_url,
        video_url: body.video_url,
        images: body.images || null,
        text_styles: body.textStyles || null,
      }])
      .select()

    if (error) {
      console.error('Supabase POST error:', error)
      throw error
    }
    return NextResponse.json(data[0], { status: 201 })
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('POST /api/projects error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// PATCH update order
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { supabase } = await import('@/lib/supabase')

    // Update order for all projects
    const updates = body.projects.map((project: any) => ({
      id: project.id,
      display_order: project.order,
    }))

    // Update each project's order
    for (const update of updates) {
      const { error } = await supabase
        .from('projects')
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
    console.error('PATCH /api/projects error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
