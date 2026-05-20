import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabasePublic } from '@/lib/supabase-public'
import { BrandDesign } from '@/lib/types'

// GET all brand designs
export async function GET() {
  try {
    const { data, error } = await supabasePublic
      .from('brand_designs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase GET error:', error)
      throw error
    }

    // Convert snake_case to camelCase for textStyles
    const formattedData = data.map((item: any) => ({
      ...item,
      textStyles: item.text_styles || undefined,
    })) || undefined

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('GET /api/brand-design error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// POST create brand design
export async function POST(request: NextRequest) {
  try {
    const body: BrandDesign = await request.json()

    const insertData: any = {
      title: body.title,
      story: body.story,
      category: body.category,
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
      .insert([insertData])
      .select()

    if (error) {
      console.error('Supabase POST error:', error)
      throw error
    }
    return NextResponse.json(data[0], { status: 201 })
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('POST /api/brand-design error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
