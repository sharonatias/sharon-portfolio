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

    // Update page content
    pageContent = {
      heroTitle: body.heroTitle || pageContent.heroTitle,
      heroRole: body.heroRole || pageContent.heroRole,
      heroSubtitle: body.heroSubtitle || pageContent.heroSubtitle,
      heroVideoUrl: body.heroVideoUrl || pageContent.heroVideoUrl
    }

    return NextResponse.json({ success: true, data: pageContent })
  } catch (error) {
    console.error('Error saving page content:', error)
    return NextResponse.json(
      { error: 'Failed to save page content' },
      { status: 500 }
    )
  }
}
