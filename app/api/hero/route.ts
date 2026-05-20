import { NextRequest, NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase-public'
import { supabase } from '@/lib/supabase'
import { HeroVideo } from '@/lib/types'

// GET hero videos
export async function GET() {
  try {
    const { data, error } = await supabasePublic
      .from('hero_videos')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase GET error:', error)
      throw error
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/hero error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// POST create hero video
export async function POST(request: NextRequest) {
  try {
    const body: HeroVideo = await request.json()

    // Get the next order number
    const { data: existingVideos } = await supabase
      .from('hero_videos')
      .select('order')
      .order('order', { ascending: false })
      .limit(1)

    const nextOrder = existingVideos && existingVideos.length > 0
      ? (existingVideos[0].order as number) + 1
      : 0

    const insertData: any = {
      video_url: body.video_url,
      title_en: body.title_en || '',
      title_he: body.title_he || '',
      description: body.description || '',
      order: nextOrder,
    }

    const { data, error } = await supabase
      .from('hero_videos')
      .insert([insertData])
      .select()

    if (error) {
      console.error('Supabase POST error:', error)
      throw error
    }
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('POST /api/hero error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// PATCH reorder hero videos
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { videos } = body

    for (const video of videos) {
      const { error } = await supabase
        .from('hero_videos')
        .update({ order: video.order })
        .eq('id', video.id)

      if (error) {
        console.error('Supabase PATCH error:', error)
        throw error
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH /api/hero error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
