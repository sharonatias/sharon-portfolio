import { NextRequest, NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase-public'

// GET all category heroes
export async function GET() {
  try {
    const { data, error } = await supabasePublic
      .from('category_heroes')
      .select('*')
      .order('display_order', { ascending: true, nullsFirst: true })

    if (error) {
      console.error('Supabase GET error:', error)
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('GET /api/category-heroes error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST create or update category hero
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { supabase } = await import('@/lib/supabase')

    // Check if exists
    const { data: existing } = await supabase
      .from('category_heroes')
      .select('id')
      .eq('category_key', body.category_key)
      .single()

    if (existing) {
      // Update
      const { data, error } = await supabase
        .from('category_heroes')
        .update({
          title: body.title,
          image_url: body.image_url,
        })
        .eq('id', existing.id)
        .select()

      if (error) {
        console.error('Supabase POST/update error:', error)
        throw error
      }
      return NextResponse.json(data[0], { status: 200 })
    } else {
      // Create
      const { data, error } = await supabase
        .from('category_heroes')
        .insert([{
          category_key: body.category_key,
          title: body.title,
          image_url: body.image_url,
          display_order: body.display_order || 0,
        }])
        .select()

      if (error) {
        console.error('Supabase POST/create error:', error)
        throw error
      }
      return NextResponse.json(data[0], { status: 201 })
    }
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('POST /api/category-heroes error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
