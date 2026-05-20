import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabasePublic } from '@/lib/supabase-public'
import { BrandDesign } from '@/lib/types'

// GET single brand design
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data, error } = await supabasePublic
      .from('brand_designs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase GET error:', error)
      throw error
    }

    // Convert snake_case to camelCase for textStyles
    const formattedData = {
      ...data,
      textStyles: data.text_styles || undefined,
    }

    return NextResponse.json(formattedData)
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('GET /api/brand-design/[id] error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// PUT update brand design
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body: BrandDesign = await request.json()

    const updateData: any = {
      title: body.title,
      story: body.story,
      logo_url: body.logo_url,
      logo_size: body.logo_size || 100,
      cover_image_url: body.cover_image_url || null,
      color_palette: body.color_palette,
      images: body.images,
      mockups: body.mockups,
      process_description: body.process_description,
      process_images: body.process_images,
      video_url: body.video_url || null,
      background_url: body.background_url || null,
      text_styles: body.textStyles || null,
      skills: body.skills || null,
    }

    const { data, error } = await supabase
      .from('brand_designs')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase UPDATE error:', error)
      throw error
    }
    return NextResponse.json(data[0])
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('PUT /api/brand-design/[id] error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// DELETE brand design
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabase.from('brand_designs').delete().eq('id', id)

    if (error) {
      console.error('Supabase DELETE error:', error)
      throw error
    }
    return NextResponse.json({ success: true })
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('DELETE /api/brand-design/[id] error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
