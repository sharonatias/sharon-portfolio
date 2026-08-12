import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Generate presigned URL for direct upload
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filename, contentType } = body

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename and contentType required' }, { status: 400 })
    }

    console.log('🔑 Generating presigned URL for:', filename)

    const bucket = contentType.startsWith('video/') ? 'videos' : 'files'
    const uniqueFilename = `${Date.now()}-${filename.replace(/\s+/g, '-')}`

    // Create signed URL valid for 1 hour
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(uniqueFilename, {
        upsert: false
      })

    if (error) {
      console.error('❌ Presigned URL error:', error)
      throw new Error(error.message)
    }

    console.log('✅ Presigned URL created:', data.signedUrl.substring(0, 50) + '...')

    return NextResponse.json({
      signedUrl: data.signedUrl,
      publicUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${uniqueFilename}`,
      filename: uniqueFilename
    })
  } catch (error) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'GET not allowed, use POST' }, { status: 405 })
}

// Force rebuild timestamp: $(date -u +%s)
