import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload request received')

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('📦 File:', { name: file.name, size: file.size })
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Try local filesystem first
    try {
      const uploadsDir = join(process.cwd(), 'public', 'uploads')

      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const filepath = join(uploadsDir, filename)

      console.log('💾 Writing to:', filepath)
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
      console.error('❌ Filesystem failed:', fsError)
      console.log('💾 Fallback: Using Base64 data URL')

      // Fallback: Convert to Base64 data URL
      const base64 = buffer.toString('base64')
      const dataUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`

      console.log('✅ Image converted to data URL')

      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: file.name,
        size: file.size,
        type: file.type
      })
    }
  } catch (error) {
    console.error('🔴 Upload error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
