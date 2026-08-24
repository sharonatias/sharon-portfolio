import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=604800',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
