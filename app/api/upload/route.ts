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
      console.error('❌ Filesystem failed, using Cloudinary:', fsError)

      // Fallback to Cloudinary
      const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

      if (!cloudinaryName || !cloudinaryPreset) {
        throw new Error('Cloudinary not configured')
      }

      const cloudinaryFormData = new FormData()
      cloudinaryFormData.append('file', new Blob([buffer], { type: file.type }), file.name)
      cloudinaryFormData.append('upload_preset', cloudinaryPreset)

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`,
        { method: 'POST', body: cloudinaryFormData as any }
      )

      if (!cloudRes.ok) {
        throw new Error(`Cloudinary failed: ${cloudRes.statusText}`)
      }

      const cloudData = await cloudRes.json() as any
      console.log('✅ Uploaded to Cloudinary:', cloudData.secure_url)

      return NextResponse.json({
        success: true,
        url: cloudData.secure_url,
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
