import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { HeroVideo } from '@/lib/types'

// PUT update hero video
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body: HeroVideo = await request.json()

    const updateData: any = {
      video_url: body.video_url,
    }
    if (body.title_en !== undefined) updateData.title_en = body.title_en
    if (body.title_he !== undefined) updateData.title_he = body.title_he
    if (body.description !== undefined) updateData.description = body.description

    const { data, error } = await supabase
      .from('hero_videos')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase UPDATE error:', error)
      throw error
    }
    return NextResponse.json(data[0])
  } catch (error) {
    console.error('PUT /api/hero/[id] error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// DELETE hero video
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabase.from('hero_videos').delete().eq('id', id)

    if (error) {
      console.error('Supabase DELETE error:', error)
      throw error
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/hero/[id] error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
