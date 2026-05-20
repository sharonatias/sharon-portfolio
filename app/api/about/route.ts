import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { About } from '@/lib/types'

// Helper function to convert snake_case from DB to camelCase for client
function formatAboutData(data: any): About | null {
  if (!data) return null

  return {
    id: data.id,
    text: data.text,
    image1_url: data.image1_url,
    image2_url: data.image2_url,
    textStyles: data.text_styles ? JSON.parse(typeof data.text_styles === 'string' ? data.text_styles : JSON.stringify(data.text_styles)) : undefined,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// GET about content
export async function GET() {
  try {
    const { supabase } = await import('@/lib/supabase')

    const { data, error } = await supabase
      .from('about')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase GET error:', error)
      throw error
    }

    const formatted = formatAboutData(data)
    console.log('📥 GET /api/about - Returning data:', JSON.stringify(formatted, null, 2))
    // Return null if no data exists yet
    return NextResponse.json(formatted)
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('GET /api/about error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST create or update about
export async function POST(request: NextRequest) {
  try {
    const body: About = await request.json()
    console.log('📨 POST /api/about - Received body:', JSON.stringify(body, null, 2))

    const { supabase } = await import('@/lib/supabase')

    // Check if about already exists
    const { data: existing } = await supabase
      .from('about')
      .select('id')
      .single()

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('about')
        .update({
          text: body.text,
          image1_url: body.image1_url,
          image2_url: body.image2_url,
          text_styles: body.textStyles || null,
        })
        .eq('id', existing.id)
        .select()

      if (error) {
        console.error('Supabase UPDATE error:', error)
        throw error
      }

      // Revalidate the about page cache
      revalidatePath('/about')
      const formatted = formatAboutData(data[0])
      console.log('✅ UPDATE successful. Saved data:', JSON.stringify(formatted, null, 2))

      return NextResponse.json(formatted, { status: 200 })
    } else {
      // Create new
      const { data, error } = await supabase
        .from('about')
        .insert([{
          text: body.text,
          image1_url: body.image1_url,
          image2_url: body.image2_url,
          text_styles: body.textStyles || null,
        }])
        .select()

      if (error) {
        console.error('Supabase INSERT error:', error)
        throw error
      }

      // Revalidate the about page cache
      revalidatePath('/about')
      const formatted = formatAboutData(data[0])
      console.log('✅ About page created and cache revalidated. Saved data:', JSON.stringify(formatted, null, 2))

      return NextResponse.json(formatted, { status: 201 })
    }
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('POST /api/about error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
