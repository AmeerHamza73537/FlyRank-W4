// Purpose: Required root layout for the Next.js App Router.
// This project is an API, so the page it wraps is just a simple info page.

export const metadata = {
  title: 'Auth Login & Protect API',
  description: 'Secure API using Supabase Auth and JWTs',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
        {children}
      </body>
    </html>
  );
}
