import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { items } = body

    console.log('📋 PATCH /api/manage-order - Received items:', JSON.stringify(items, null, 2))

    const { supabase } = await import('@/lib/supabase')

    // Update display_order for all items
    const results = []
    for (const item of items) {
      const { type, id, order } = item

      try {
        console.log(`  Updating ${type}[${id}] with order: ${order}`)
        const { data, error } = await supabase
          .from(type)
          .update({ display_order: order })
          .eq('id', id)
          .select()

        if (error) {
          // Check if it's a missing column error
          if (error.message?.includes('display_order')) {
            console.error(`❌ Column 'display_order' missing on table '${type}'`)
            return NextResponse.json({
              error: `Missing database column: display_order on ${type} table`,
              requiresMigration: true,
              migrationSql: `ALTER TABLE public.${type} ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;`
            }, { status: 409 })
          }
          console.error(`❌ Error updating ${type}[${id}]:`, error)
          throw error
        }
        console.log(`  ✅ Updated ${type}[${id}]:`, data)
        results.push({ type, id, success: true, data })
      } catch (itemError: any) {
        console.error(`❌ Error updating ${type} with id ${id}:`, itemError.message)
        throw itemError
      }
    }

    console.log('✅ All items updated successfully:', JSON.stringify(results, null, 2))
    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error)
    console.error('❌ PATCH /api/manage-order error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
