import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Migration endpoint to add brand_applications column to brand_case_studies table
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const adminPassword = request.headers.get('x-admin-token')
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Supabase client with service role (for schema modifications)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false }
      }
    )

    console.log('Running migration: Adding brand_applications to brand_case_studies...')

    let error: any = null
    let data: any = null

    try {
      const result = await supabase.rpc('query', {
        query: `ALTER TABLE public.brand_case_studies ADD COLUMN IF NOT EXISTS brand_applications JSONB DEFAULT '[]'::JSONB;`
      })
      data = result.data
      error = result.error
    } catch (err) {
      error = err
    }

    if (error) {
      console.log('RPC method not available, returning SQL instructions...')
      return NextResponse.json({
        success: false,
        message: 'Please execute this SQL in Supabase SQL Editor',
        sql: `ALTER TABLE public.brand_case_studies ADD COLUMN IF NOT EXISTS brand_applications JSONB DEFAULT '[]'::JSONB;`,
        instructions: {
          step1: 'Go to your Supabase SQL Editor',
          step2: 'Copy and paste the SQL above',
          step3: 'Click Execute'
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully'
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({
      error: error.message,
      message: 'Migration failed - may need manual SQL execution'
    }, { status: 500 })
  }
}
