import { createClient } from '@supabase/supabase-js'

// Read-only client used by public API routes (server side only).
// SUPABASE_PUBLISHABLE_KEY holds the new sb_publishable_ key; the old anon key is a fallback.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabasePublic = createClient(supabaseUrl, supabaseKey)
