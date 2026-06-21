import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload request received, method:', request.method)
    console.log('📤 Headers:', Object.fromEntries(request.headers.entries()))

    let formData
    try {
      formData = await request.formData()
    } catch (formError) {
      console.error('❌ FormData parsing error:', formError)
      return NextResponse.json({ error: 'Failed to parse form data: ' + String(formError) }, { status: 400 })
    }

    const file = formData.get('file') as File

    if (!file || !(file instanceof File)) {
      console.error('❌ No file in FormData')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('📦 File:', { name: file.name, size: file.size, type: file.type })

    // Check file size - max 2MB
    const MAX_SIZE = 2 * 1024 * 1024 // 2MB
    if (file.size > MAX_SIZE) {
      console.warn(`⚠️ File too large: ${file.size} bytes`)
      return NextResponse.json({
        error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum 2MB allowed.`
      }, { status: 413 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Check if we're in a read-only environment
    const isReadOnly = process.cwd().includes('/var/task') || process.cwd().includes('/lambda')

    if (isReadOnly) {
      console.log('⚠️ Read-only environment detected, using Base64')
      // Use Base64 for read-only environments
      const base64 = buffer.toString('base64')
      const dataUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`

      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: file.name,
        size: file.size,
        type: file.type
      })
    }

    // Try local filesystem for writable environments
    try {
      const { writeFile, mkdir } = await import('fs/promises')
      const { join } = await import('path')
      const { existsSync } = await import('fs')

      const uploadsDir = join(process.cwd(), 'public', 'uploads')

      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const filepath = join(uploadsDir, filename)

      await writeFile(filepath, buffer)

      const fileUrl = `/uploads/${filename}`
      console.log('✅ Saved to filesystem:', fileUrl)

      return NextResponse.json({
        success: true,
        url: fileUrl,
        filename: file.name,
        size: file.size,
        type: file.type
      })
    } catch (fsError) {
      console.error('❌ Filesystem write failed:', fsError)
      // Fallback to Base64
      const base64 = buffer.toString('base64')
      const dataUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`
      console.log('✅ Fallback to Base64 data URL')

      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: file.name,
        size: file.size,
        type: file.type
      })
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
