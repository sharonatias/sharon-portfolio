import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://whqqammiamoajavokauw.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocXFhbW1pYW1vYWphdm9rYXV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY4OTk5NCwiZXhwIjoyMDk0MjI2NTk5NH0.v5M7u8kndJqP3hvrfPjRaZit-8IHUht09OOJ14lG1ks'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Cloudinary URLs for the 3 featured projects
const imageUrls = {
  'storytelling': 'https://res.cloudinary.com/dy9toyl3s/image/upload/f_auto,q_auto/v1/sharon-featured-images/storytelling',
  'el-mistater': 'https://res.cloudinary.com/dy9toyl3s/image/upload/f_auto,q_auto/v1/sharon-featured-images/el-mistater',
  'shlomo': 'https://res.cloudinary.com/dy9toyl3s/image/upload/f_auto,q_auto/v1/sharon-featured-images/shlomo'
}

async function updateToCloudinary() {
  try {
    console.log('📸 Updating project images to Cloudinary URLs...\n')

    // Update each project with Cloudinary URL
    const projectUpdates = [
      {
        id: 'storytelling',
        title: 'Creating storytelling for production studios',
        url: imageUrls.storytelling
      },
      {
        id: 'el-mistater',
        title: 'El Mistater Music Video',
        url: imageUrls['el-mistater']
      },
      {
        id: 'shlomo',
        title: 'Shlomo - La Vie Est Belle',
        url: imageUrls.shlomo
      }
    ]

    for (const update of projectUpdates) {
      // Query by name/title to find the project
      const { data: existingProjects, error: queryError } = await supabase
        .from('projects')
        .select('id, title, image_url')
        .ilike('title', `%${update.title}%`)

      if (queryError) {
        console.error(`❌ Error querying ${update.title}:`, queryError)
        continue
      }

      if (existingProjects && existingProjects.length > 0) {
        const project = existingProjects[0]
        const { error: updateError } = await supabase
          .from('projects')
          .update({ image_url: update.url })
          .eq('id', project.id)

        if (updateError) {
          console.error(`❌ Error updating ${update.title}:`, updateError)
        } else {
          console.log(`✅ Updated: ${update.title}`)
          console.log(`   ${update.url}\n`)
        }
      } else {
        console.log(`⚠️  Project not found: ${update.title}\n`)
      }
    }

    console.log('✨ Done! Images should now display with Cloudinary URLs.')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

updateToCloudinary()
