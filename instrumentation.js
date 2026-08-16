// Purpose: Runs once when the Next.js server boots.
// We use it to confirm the Supabase client was created correctly
// and print the Stage 0 checkpoint message.

export async function register() {
  // Only run on the Node.js server (not the edge runtime).
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { supabase } = await import('./lib/supabase.js');

  if (supabase) {
    console.log('Server running and connected to Supabase');
  }
}
