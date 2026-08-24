import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

cloudinary.config({
  cloud_name: 'dy9toyl3s',
  api_key: '642743859783489',
  api_secret: '7bX_5Kq3-Gb3hv9mZk2l8Wq9k5Z'
})

// Create simple placeholder images with canvas or just use test images
async function uploadTestImages() {
  console.log('📸 Creating and uploading test images...\n')

  const imageUrls = {}

  // These URLs point to public test images from unsplash-like sources
  const testImages = {
    'storytelling': 'https://images.unsplash.com/photo-1516035069371-29a08e8f3fee?w=1200&h=900&fit=crop',
    'el-mistater': 'https://images.unsplash.com/photo-1498038432885-17039f4a9e71?w=1200&h=900&fit=crop',
    'shlomo': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=900&fit=crop'
  }

  try {
    for (const [name, imageUrl] of Object.entries(testImages)) {
      console.log(`Uploading ${name}...`)

      const result = await cloudinary.uploader.upload(imageUrl, {
        public_id: `sharon-featured-images/${name}`,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        secure: true
      })

      imageUrls[name] = result.secure_url
      console.log(`✅ ${name}`)
      console.log(`   ${result.secure_url}\n`)
    }

    console.log('✨ All images uploaded to Cloudinary!')
    console.log('\nUpdate database with these URLs:')
    console.log(JSON.stringify(imageUrls, null, 2))
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

uploadTestImages()
