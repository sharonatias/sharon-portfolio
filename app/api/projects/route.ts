import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Project } from '@/lib/types'

// GET all projects
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST create project
export async function POST(request: NextRequest) {
  try {
    const body: Project = await request.json()

    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          title: body.title,
          description: body.description,
          category: body.category,
          image_url: body.image_url,
          video_url: body.video_url,
        },
      ])
      .select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
