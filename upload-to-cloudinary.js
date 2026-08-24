import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dy9toyl3s',
  api_key: '642743859783489',
  api_secret: '7bX_5Kq3-Gb3hv9mZk2l8Wq9k5Z'
});

const imageFile = '/private/tmp/claude-501/-Users-attias/6d374e7f-6c86-407b-aab1-d5e9df84c38e/scratchpad/test-image.jpg';

(async () => {
  try {
    if (!fs.existsSync(imageFile)) {
      console.log('Image file not found, skipping upload');
      return;
    }

    console.log('Uploading to Cloudinary...');
    const result = await cloudinary.uploader.upload(imageFile, {
      public_id: 'sharon-featured-images',
      resource_type: 'auto'
    });

    console.log('✅ Uploaded to Cloudinary:');
    console.log('URL:', result.secure_url);
    console.log('\nNow update the database with this URL for all 3 projects');
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
