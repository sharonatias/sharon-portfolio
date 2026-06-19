import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'לא נבחר קובץ' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = join(process.cwd(), 'public', 'uploads')

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const filepath = join(uploadsDir, filename)

    await writeFile(filepath, buffer)

    const fileUrl = `/uploads/${filename}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: file.name,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'שגיאה בהעלאת הקובץ' },
      { status: 500 }
    )
  }
}
