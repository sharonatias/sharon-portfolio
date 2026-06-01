import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { publicId, folder, resourceType = 'auto' } = body

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiSecret) {
      return NextResponse.json(
        { error: 'Missing Cloudinary credentials' },
        { status: 500 }
      )
    }

    // Generate timestamp
    const timestamp = Math.floor(Date.now() / 1000)

    // Build the string to sign
    const paramsToSign = {
      cloud_name: cloudName,
      resource_type: resourceType,
      timestamp,
      ...(publicId && { public_id: publicId }),
      ...(folder && { folder }),
    }

    // Create signature string
    const sortedKeys = Object.keys(paramsToSign).sort()
    const signatureString = sortedKeys
      .map((key) => `${key}=${paramsToSign[key as keyof typeof paramsToSign]}`)
      .join('&')

    const signature = crypto
      .createHash('sha256')
      .update(signatureString + apiSecret)
      .digest('hex')

    return NextResponse.json({
      signature,
      timestamp,
      cloudName,
      apiSecret: undefined, // Never expose secret to client
    })
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error)
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    )
  }
}
