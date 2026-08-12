import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const updates = [
      {
        id: '3e200378-1a5e-4cea-ada4-473b0395410e',
        title: 'Creating storytelling for production studios',
        image_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=900&fit=crop'
      },
      {
        id: '01e1b575-fc71-48e4-8894-aa4df8dafd40',
        title: 'El Mistater Music Video',
        image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=900&fit=crop'
      },
      {
        id: '3b107b7e-d191-49e7-8886-e6ec9663173e',
        title: 'Shlomo - La Vie Est Belle',
        image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=900&fit=crop'
      }
    ]

    for (const update of updates) {
      const { error } = await supabase
        .from('projects')
        .update({ image_url: update.image_url })
        .eq('id', update.id)

      if (error) {
        console.error(`Failed to update ${update.title}:`, error)
      } else {
        console.log(`✅ Updated: ${update.title}`)
      }
    }

    return NextResponse.json({ success: true, message: 'Images updated' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to update images' },
      { status: 500 }
    )
  }
}
