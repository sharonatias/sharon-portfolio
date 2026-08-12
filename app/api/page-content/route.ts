import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const defaultContent = {
  heroTitle: 'Creating documentaries, brands and visual experiences.',
  heroRole: 'FILMMAKER • CREATIVE DIRECTOR',
  heroSubtitle: 'Blending design and AI-driven creation.',
  heroVideoUrl: '',
  featured_project_ids: '',
  featured_visible: true,
  exploring_ids: '',
  exploring_visible: true,
  ai_experiments_ids: '',
  ai_experiments_visible: true
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function readPageContent() {
  try {
    console.log('📖 Reading from Supabase...')
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      console.error('📖 Supabase error:', error.message)
      return defaultContent
    }

    console.log('✅ Loaded from Supabase:', data)
    // Normalize field names (Supabase uses lowercase)
    return {
      heroTitle: data.herotitle || data.heroTitle || defaultContent.heroTitle,
      heroRole: data.herorole || data.heroRole || defaultContent.heroRole,
      heroSubtitle: data.herosubtitle || data.heroSubtitle || defaultContent.heroSubtitle,
      heroVideoUrl: data.herovideourl || data.heroVideoUrl || defaultContent.heroVideoUrl,
      featured_project_ids: data.featured_project_ids || defaultContent.featured_project_ids,
      featured_visible: data.featured_visible !== undefined ? data.featured_visible : defaultContent.featured_visible,
      exploring_ids: data.exploring_ids || defaultContent.exploring_ids,
      exploring_visible: data.exploring_visible !== undefined ? data.exploring_visible : defaultContent.exploring_visible,
      ai_experiments_ids: data.ai_experiments_ids || defaultContent.ai_experiments_ids,
      ai_experiments_visible: data.ai_experiments_visible !== undefined ? data.ai_experiments_visible : defaultContent.ai_experiments_visible
    }
  } catch (error) {
    console.log('📖 Using default content')
    return defaultContent
  }
}

async function writePageContent(content: any) {
  try {
    console.log('📝 Writing to Supabase:', content)

    const { data, error } = await supabase
      .from('page_content')
      .upsert({
        id: 1,
        herotitle: content.heroTitle,
        herorole: content.heroRole,
        herosubtitle: content.heroSubtitle,
        herovideourl: content.heroVideoUrl,
        featured_project_ids: content.featured_project_ids || '',
        featured_visible: content.featured_visible,
        exploring_ids: content.exploring_ids || '',
        exploring_visible: content.exploring_visible,
        ai_experiments_ids: content.ai_experiments_ids || '',
        ai_experiments_visible: content.ai_experiments_visible,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase error details:', {
        code: error.code,
        message: error.message,
        hint: error.hint,
        details: error.details
      })
      throw new Error(`Supabase error: ${error.message}`)
    }

    console.log('✅ Saved to Supabase:', data)
    return data
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
      heroVideoUrl: body.heroVideoUrl !== undefined ? body.heroVideoUrl : currentContent.heroVideoUrl,
      featured_project_ids: body.featured_project_ids !== undefined ? body.featured_project_ids : currentContent.featured_project_ids,
      featured_visible: body.featured_visible !== undefined ? body.featured_visible : currentContent.featured_visible,
      exploring_ids: body.exploring_ids !== undefined ? body.exploring_ids : currentContent.exploring_ids,
      exploring_visible: body.exploring_visible !== undefined ? body.exploring_visible : currentContent.exploring_visible,
      ai_experiments_ids: body.ai_experiments_ids !== undefined ? body.ai_experiments_ids : currentContent.ai_experiments_ids,
      ai_experiments_visible: body.ai_experiments_visible !== undefined ? body.ai_experiments_visible : currentContent.ai_experiments_visible
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
