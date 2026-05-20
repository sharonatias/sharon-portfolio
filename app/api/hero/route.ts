import { NextResponse } from 'next/server'

// GET hero videos - return empty array for now
export async function GET() {
  return NextResponse.json([])
}
