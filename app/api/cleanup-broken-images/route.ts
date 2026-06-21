import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    console.log('🔍 Scanning for broken image paths...')

    // Get all records with /uploads/ paths
    const { data: studies, error: fetchError } = await supabase
      .from('brand_case_studies')
      .select('id, title, hero_image')

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
    }

    const broken = studies?.filter(s =>
      s.hero_image && s.hero_image.includes('/uploads/')
    ) || []

    console.log(`Found ${broken.length} records with broken /uploads/ paths`)

    const cleaned = []
    for (const study of broken) {
      console.log(`Cleaning: ${study.title} (${study.id})`)

      const { error } = await supabase
        .from('brand_case_studies')
        .update({ hero_image: null })
        .eq('id', study.id)

      if (error) {
        console.error(`Error cleaning ${study.id}:`, error)
      } else {
        cleaned.push(study.id)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned ${cleaned.length} broken images`,
      cleaned_ids: cleaned,
      total_found: broken.length
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Cleanup error:', msg, error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
