import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://whqqammiamoajavokauw.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocXFhbW1pYW1vYWphdm9rYXV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY4OTk5NCwiZXhwIjoyMDk0MjY1OTk0fQ.v5M7u8kndJqP3hvrfPjRaZit-8IHUht09OOJ14lG1ks';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupBase64Images() {
  try {
    console.log('🧹 Fetching projects with base64 images...');

    // Get all projects
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('id, title, image_url')
      .not('image_url', 'is', null);

    if (fetchError) throw fetchError;

    // Filter projects with base64 images
    const base64Projects = projects.filter(p =>
      p.image_url && p.image_url.startsWith('data:image')
    );

    console.log(`Found ${base64Projects.length} projects with base64 images:`);
    base64Projects.forEach(p => {
      console.log(`  - ${p.title} (${p.image_url.substring(0, 50)}...)`);
    });

    if (base64Projects.length === 0) {
      console.log('✅ No base64 images found!');
      return;
    }

    console.log('\n📝 Cleaning up base64 images...');

    // Update all projects with base64 images to set image_url to empty string
    for (const project of base64Projects) {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ image_url: '' })
        .eq('id', project.id);

      if (updateError) {
        console.error(`❌ Error updating ${project.title}:`, updateError);
      } else {
        console.log(`✅ Cleaned ${project.title}`);
      }
    }

    console.log('\n🎉 Cleanup complete!');
    console.log('Next step: Go to admin dashboard and re-upload proper images for these projects.');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanupBase64Images();
