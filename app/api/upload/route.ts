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
      console.error('❌ No file in form data or not a File')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('📦 File received:', { name: file.name, size: file.size, type: file.type })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Try local filesystem first
    try {
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      console.log('📍 Uploads directory:', uploadsDir)

      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const filepath = join(uploadsDir, filename)

      console.log('💾 Writing file to:', filepath)
      await writeFile(filepath, buffer)
      const fileUrl = `/uploads/${filename}`
      console.log('✅ File saved to filesystem:', fileUrl)

      return NextResponse.json({
        success: true,
        url: fileUrl,
        filename: file.name,
        size: file.size,
        type: file.type
      })
    } catch (fsError) {
      console.error('❌ Filesystem write failed:', fsError)

      // Fallback: Use /tmp directory
      const tmpPath = `/tmp/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      console.log('💾 Fallback: Writing to /tmp:', tmpPath)

      try {
        await writeFile(tmpPath, buffer)
        // Return with /tmp path so browser can serve it
        const fileUrl = tmpPath
        console.log('✅ File saved to /tmp')

        return NextResponse.json({
          success: true,
          url: fileUrl,
          filename: file.name,
          size: file.size,
          type: file.type
        })
      } catch (tmpError) {
        console.error('❌ /tmp write also failed:', tmpError)
        throw tmpError
      }
    }
  } catch (error) {
    console.error('🔴 Upload error:', error)
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    )
  }
}
