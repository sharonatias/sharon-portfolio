import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Migration endpoint to add display_order column to brand_designs table
// Requires admin credentials
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

    // Execute the migration - add column to brand_designs table
    console.log('Running migration: Adding display_order to brand_designs...')

    // Use a raw query approach through postgres
    let error: any = null
    let data: any = null

    try {
      const result = await supabase.rpc('query', {
        query: `ALTER TABLE public.brand_designs ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
                CREATE INDEX IF NOT EXISTS idx_brand_designs_display_order ON public.brand_designs(display_order);`
      })
      data = result.data
      error = result.error
    } catch (err) {
      error = err
    }

    // If rpc doesn't work, return instructions
    if (error) {
      console.log('RPC method not available, returning SQL instructions...')
      return NextResponse.json({
        success: false,
        message: 'Please execute this SQL in Supabase SQL Editor',
        sql: `ALTER TABLE public.brand_designs ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_brand_designs_display_order ON public.brand_designs(display_order);`,
        instructions: {
          step1: 'Go to https://app.supabase.com/project/whqqammiamoajavokauw/sql/new',
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
