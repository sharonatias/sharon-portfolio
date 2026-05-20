import { NextRequest, NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase-public'

// GET app case by brand design id
export async function GET(request: NextRequest, { params }: { params: Promise<{ brandId: string }> }) {
  try {
    const { brandId } = await params
    const { data, error } = await supabasePublic
      .from('app_cases')
      .select('*')
      .eq('brand_design_id', brandId)
      .maybeSingle()

    if (error) {
      console.error('Supabase GET error:', error)
      throw error
    }

    // Return null if no case study found, not an error
    return NextResponse.json(data || null)
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('GET /api/app-cases/by-brand/[brandId] error:', errorMessage)
    return NextResponse.json(null)
  }
}
