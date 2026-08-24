import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://whqqammiamoajavokauw.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocXFhbW1pYW1vYWphdm9rYXV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY4OTk5NCwiZXhwIjoyMDk0MjY1OTk0fQ.v5M7u8kndJqP3hvrfPjRaZit-8IHUht09OOJ14lG1ks'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateVideoUrl() {
  try {
    console.log('🎬 Updating hero video to Bunny CDN Pull Zone...\n')

    const { data, error } = await supabase
      .from('hero_videos')
      .update({
        video_url: 'https://sharon.b-cdn.net/showreel.mp4'
      })
      .eq('id', '65696215-2f5f-478e-a1c1-794ad407fe3f')
      .select()

    if (error) {
      console.error('❌ Error:', error)
    } else {
      console.log('✅ Video URL updated successfully!')
      console.log('📹 New URL:', data[0].video_url)
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

updateVideoUrl()
