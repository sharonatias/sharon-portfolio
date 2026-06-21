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

    const uploadsDir = join(process.cwd(), 'public', 'uploads')

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const filepath = join(uploadsDir, filename)

    console.log('💾 Writing file to:', filepath)
    await writeFile(filepath, buffer)

    const fileUrl = `/uploads/${filename}`

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
