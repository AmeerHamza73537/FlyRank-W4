# Auth Login & Protect

A secure API built with Next.js and Supabase Auth. Users can sign up, log in and
log out; some routes are protected by a JWT and some are public.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Supabase Project URL and Anon Key
   (Supabase Dashboard -> Project Settings -> API).

3. Start the server:

   ```bash
   npm run dev
   ```

   It runs on http://localhost:3000 and logs
   `Server running and connected to Supabase`.

## Routes

| Method | Route                | Purpose                     | Auth |
| ------ | -------------------- | --------------------------- | ---- |
| POST   | `/auth/signup`       | Create a new user account   | No   |
| POST   | `/auth/login`        | Log in and receive a JWT    | No   |
| POST   | `/auth/logout`       | End the user session        | Yes  |
| GET    | `/protected/profile` | Read private profile data   | Yes  |
| GET    | `/public/info`       | Read public data            | No   |

(Routes are added in the later stages.)
