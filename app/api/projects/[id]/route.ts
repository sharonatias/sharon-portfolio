import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Project } from '@/lib/types'

// PUT update project
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body: Project = await request.json()

    const { data, error } = await supabase
      .from('projects')
      .update({
        title: body.title,
        description: body.description,
        category: body.category,
        image_url: body.image_url,
        video_url: body.video_url,
        images: body.images || null,
        text_styles: body.textStyles || null,
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
    console.error('PUT /api/projects/[id] error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// DELETE project
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
