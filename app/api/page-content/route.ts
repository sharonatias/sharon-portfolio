import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for page content (in production, this would be in a database)
let pageContent = {
  heroTitle: 'Creating documentaries, brands and visual experiences.',
  heroRole: 'FILMMAKER • CREATIVE DIRECTOR',
  heroSubtitle: 'Blending design and AI-driven creation.',
  heroVideoUrl: ''
}

export async function GET() {
  return NextResponse.json(pageContent)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Received page content:', body)

    // Update page content - use the values from body directly
    pageContent = {
      heroTitle: body.heroTitle !== undefined ? body.heroTitle : pageContent.heroTitle,
      heroRole: body.heroRole !== undefined ? body.heroRole : pageContent.heroRole,
      heroSubtitle: body.heroSubtitle !== undefined ? body.heroSubtitle : pageContent.heroSubtitle,
      heroVideoUrl: body.heroVideoUrl !== undefined ? body.heroVideoUrl : pageContent.heroVideoUrl
    }

    console.log('✅ Updated page content:', pageContent)
    return NextResponse.json({ success: true, data: pageContent })
  } catch (error) {
    console.error('❌ Error saving page content:', error)
    return NextResponse.json(
      { error: 'Failed to save page content' },
      { status: 500 }
    )
  }
}
