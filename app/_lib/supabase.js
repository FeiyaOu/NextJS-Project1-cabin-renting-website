// Create the Supabase client lazily so the module doesn't import
// the full `@supabase/supabase-js` bundle at module evaluation time.
// This helps avoid accidentally pulling Node-only APIs into Edge runtime bundles.

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

let _supabase;
export function getSupabase() {
  if (_supabase) return _supabase;
  // dynamic import keeps the heavy/node-bound code out of edge bundles
  const { createClient } = require('@supabase/supabase-js');
  _supabase = createClient(supabaseUrl, supabaseKey);
  return _supabase;
}

// For callers that previously imported `supabase`, keep a compat export
// Note: prefer using `getSupabase()` in server code to ensure correct bundling.
export const supabase = {
  from: (...args) => getSupabase().from(...args),
  auth: getSupabase().auth,
  // other commonly used top-level helpers can be proxied as needed
};
