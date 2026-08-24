import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://whqqammiamoajavokauw.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocXFhbW1pYW1vYWphdm9rYXV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY4OTk5NCwiZXhwIjoyMDk0MjY1OTk0fQ.v5M7u8kndJqP3hvrfPjRaZit-8IHUht09OOJ14lG1ks';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

(async () => {
  try {
    // Get the three project IDs
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title')
      .in('title', [
        'Shlomo - La Vie Est Belle',
        '"El Mistater" Music Video',
        'Creating storytelling for production studios'
      ]);

    const projectIds = projects.map(p => p.id).join(',');
    console.log('Project IDs:', projectIds);

    // Update page_content with these project IDs
    const { error } = await supabase
      .from('page_content')
      .update({ featured_project_ids: projectIds })
      .eq('id', 1);

    if (error) {
      console.error('❌ Error updating page_content:', error);
    } else {
      console.log('✅ Updated featured_project_ids!');
      console.log('Projects:', projects.map(p => p.title));
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
