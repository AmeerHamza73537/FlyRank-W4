// Purpose: Simple home page so visiting http://localhost:3000 shows
// that the server is alive. The real work happens in the /api routes.

export default function Home() {
  return (
    <main>
      <h1>Auth Login &amp; Protect API</h1>
      <p>Server is running and connected to Supabase.</p>
    </main>
  );
}
