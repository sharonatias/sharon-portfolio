import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const defaultContent = {
  heroTitle: 'Creating documentaries, brands and visual experiences.',
  heroRole: 'FILMMAKER • CREATIVE DIRECTOR',
  heroSubtitle: 'Blending design and AI-driven creation.',
  heroVideoUrl: ''
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function readPageContent() {
  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .single()

    if (error) throw error
    return data || defaultContent
  } catch (error) {
    console.log('📖 Using default content')
    return defaultContent
  }
}

async function writePageContent(content: any) {
  try {
    console.log('📝 Saving to Supabase:', content)

    const { data, error } = await supabase
      .from('page_content')
      .upsert([{ id: 1, ...content, updated_at: new Date() }])
      .select()
      .single()

    if (error) throw error
    console.log('✅ Saved to Supabase:', data)
  } catch (error) {
    console.error('❌ Error saving to Supabase:', error)
    throw error
  }
}

export async function GET() {
  const content = await readPageContent()
  return NextResponse.json(content)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Received page content:', body)

    const currentContent = await readPageContent()

    // Update page content
    const updatedContent = {
      heroTitle: body.heroTitle !== undefined ? body.heroTitle : currentContent.heroTitle,
      heroRole: body.heroRole !== undefined ? body.heroRole : currentContent.heroRole,
      heroSubtitle: body.heroSubtitle !== undefined ? body.heroSubtitle : currentContent.heroSubtitle,
      heroVideoUrl: body.heroVideoUrl !== undefined ? body.heroVideoUrl : currentContent.heroVideoUrl
    }

    await writePageContent(updatedContent)

    console.log('✅ Updated page content:', updatedContent)
    return NextResponse.json({ success: true, data: updatedContent })
  } catch (error) {
    console.error('❌ Error saving page content:', error)
    return NextResponse.json(
      { error: 'Failed to save page content' },
      { status: 500 }
    )
  }
}
