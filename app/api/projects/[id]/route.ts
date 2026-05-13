import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Project } from '@/lib/types'

// PUT update project
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body: Project = await request.json()

    const { data, error } = await supabase
      .from('projects')
      .update({
        title: body.title,
        description: body.description,
        category: body.category,
        image_url: body.image_url,
        video_url: body.video_url,
      })
      .eq('id', params.id)
      .select()

    if (error) throw error
    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE project
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from('projects').delete().eq('id', params.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
