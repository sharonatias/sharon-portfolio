import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://whqqammiamoajavokauw.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocXFhbW1pYW1vYWphdm9rYXV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY4OTk5NCwiZXhwIjoyMDk0MjY1OTk0fQ.v5M7u8kndJqP3hvrfPjRaZit-8IHUht09OOJ14lG1ks'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function generateSignedUrls() {
  try {
    const files = [
      '1786536043605-storytelling-test.jpg',
      '1786536117071-el-mistater-test.jpg',
      '1786535963461-shlomo-test.jpg'
    ]

    console.log('🔐 Generating signed URLs for project images...\n')

    for (const file of files) {
      const { data, error } = await supabase.storage
        .from('files')
        .createSignedUrl(file, 60 * 60 * 24 * 7) // 7 days

      if (error) {
        console.error(`❌ Error for ${file}:`, error)
      } else {
        console.log(`✅ ${file}`)
        console.log(`   ${data.signedUrl}\n`)
      }
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

generateSignedUrls()
