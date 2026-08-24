import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://whqqammiamoajavokauw.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocXFhbW1pYW1vYWphdm9rYXV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY4OTk5NCwiZXhwIjoyMDk0MjY1OTk0fQ.v5M7u8kndJqP3hvrfPjRaZit-8IHUht09OOJ14lG1ks';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const updates = [
  {
    title: 'Shlomo - La Vie Est Belle',
    imageUrl: 'https://whqqammiamoajavokauw.supabase.co/storage/v1/object/public/files/1786535963461-shlomo-test.jpg'
  },
  {
    title: 'Creating storytelling for production studios',
    imageUrl: 'https://whqqammiamoajavokauw.supabase.co/storage/v1/object/public/files/1786536043605-storytelling-test.jpg'
  },
  {
    title: '"El Mistater" Music Video',
    imageUrl: 'https://whqqammiamoajavokauw.supabase.co/storage/v1/object/public/files/1786536117071-el-mistater-test.jpg'
  }
];

(async () => {
  for (const update of updates) {
    console.log(`Updating: ${update.title}`);

    const { error } = await supabase
      .from('projects')
      .update({ image_url: update.imageUrl })
      .eq('title', update.title);

    if (error) {
      console.error(`❌ Error updating ${update.title}:`, error);
    } else {
      console.log(`✅ Updated ${update.title}`);
    }
  }

  console.log('\n✅ All projects updated!');
})();
