import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Cloudinary upload request received')

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('📦 File:', { name: file.name, size: file.size, type: file.type })

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      console.error('❌ Missing Cloudinary config')
      return NextResponse.json({
        error: 'Cloudinary not configured'
      }, { status: 500 })
    }

    // Upload to Cloudinary
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', file)
    cloudinaryFormData.append('upload_preset', uploadPreset)

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: 'POST', body: cloudinaryFormData }
    )

    if (!cloudRes.ok) {
      const error = await cloudRes.text()
      console.error('❌ Cloudinary error:', error)
      return NextResponse.json({
        error: `Cloudinary upload failed: ${cloudRes.status}`
      }, { status: 502 })
    }

    const cloudData = await cloudRes.json()
    console.log('✅ Cloudinary upload successful:', cloudData.secure_url)

    return NextResponse.json({
      success: true,
      url: cloudData.secure_url,
      filename: file.name,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('🔴 Upload error:', msg, error)
    return NextResponse.json({
      error: 'Upload failed: ' + msg
    }, { status: 500 })
  }
}
