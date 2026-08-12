import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload request received')

    let formData
    try {
      formData = await request.formData()
    } catch (formError) {
      console.error('❌ FormData parsing error:', formError)
      return NextResponse.json({ error: 'Failed to parse form data' }, { status: 400 })
    }

    const file = formData.get('file') as File

    if (!file || !(file instanceof File)) {
      console.error('❌ No file in FormData')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('📦 File:', { name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + 'MB', type: file.type })

    // Large file size limit (500MB for videos, 50MB for others)
    const isVideo = file.type.startsWith('video/')
    const MAX_SIZE = isVideo ? 500 * 1024 * 1024 : 50 * 1024 * 1024

    if (file.size > MAX_SIZE) {
      const maxMB = isVideo ? 500 : 50
      console.warn(`⚠️ File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB`)
      return NextResponse.json({
        error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum ${maxMB}MB allowed.`
      }, { status: 413 })
    }

    try {
      // Upload to Supabase Storage
      const bucket = isVideo ? 'videos' : 'files'
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      console.log(`📤 Uploading to Supabase ${bucket} bucket: ${filename}`)

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: false
        })

      if (error) {
        console.error('❌ Supabase upload error:', error)
        throw new Error(`Supabase upload failed: ${error.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filename)

      console.log('✅ Uploaded to Supabase:', publicUrl)

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: file.name,
        size: file.size,
        type: file.type
      })
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      console.error('❌ Upload error:', msg)
      return NextResponse.json({
        error: msg,
        details: String(error)
      }, { status: 500 })
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('🔴 Upload error:', msg, error)
    return NextResponse.json({
      error: 'Upload failed: ' + msg,
      details: String(error)
    }, { status: 500 })
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json({ error: 'GET not allowed, use POST' }, { status: 405 })
}

// Force rebuild timestamp: $(date -u +%s)
