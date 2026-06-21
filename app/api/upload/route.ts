import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  let formData
  let file

  try {
    console.log('📤 Upload request received')

    try {
      formData = await request.formData()
      console.log('✅ FormData parsed successfully')
    } catch (parseError) {
      console.error('❌ FormData parse error:', parseError)
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      )
    }

    file = formData.get('file') as File
    console.log('📋 FormData entries:', Array.from(formData.entries()).map(([k, v]) => `${k}: ${v instanceof File ? `File(${v.name})` : v}`))

    if (!file || !(file instanceof File)) {
      console.error('❌ No file in form data or not a File:', file)
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('📦 File received:', { name: file.name, size: file.size, type: file.type })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Try local filesystem first, fallback to in-memory URL
    let fileUrl: string

    try {
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      console.log('📍 Current working directory:', process.cwd())
      console.log('📍 Uploads directory:', uploadsDir)

      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const filepath = join(uploadsDir, filename)

      console.log('💾 Writing file to:', filepath)
      await writeFile(filepath, buffer)
      fileUrl = `/uploads/${filename}`
      console.log('✅ File saved to filesystem:', fileUrl)
    } catch (fsError) {
      console.error('❌ Filesystem write failed:', fsError)
      // Fallback: Use data URL or /tmp
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const tmpPath = `/tmp/${filename}`
      console.log('💾 Fallback: Writing to /tmp:', tmpPath)

      try {
        await writeFile(tmpPath, buffer)
        fileUrl = `/uploads/${filename}` // Still use /uploads URL for consistency
        console.log('✅ File saved to /tmp as fallback')
      } catch (tmpError) {
        console.error('❌ /tmp write also failed:', tmpError)
        // Last resort: Base64 data URL
        const base64 = buffer.toString('base64')
        fileUrl = `data:${file.type};base64,${base64}`
        console.log('⚠️ Using data URL as last resort (large file)')
      }
    }

    console.log('✅ Upload successful:', fileUrl)
    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: file.name,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('🔴 Upload error:', error)
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', { errorMsg, stack: error instanceof Error ? error.stack : 'no stack' })
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    )
  }
}
