// Purpose: Create one shared Supabase client for the whole app.
// Every route that needs Supabase (signup, login, logout, token check)
// imports this file instead of creating its own client.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

// Fail early with a clear message if the .env values are missing.
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // This is a server-side API, so we never store sessions on disk.
    // The client (Postman / Swagger) keeps the token and sends it back to us.
    persistSession: false,
  },
});
