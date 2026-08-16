# Auth Login & Protect

A secure REST API built with **Next.js** and **Supabase Auth**.

Users can sign up, log in and log out. Logging in returns a **JWT access token**,
and that token is required to open the protected routes. Public routes stay open
to everyone. All endpoints are documented and testable in **Swagger UI**.

Passwords are never stored or hashed by this project. Supabase acts as the
Identity Provider: it checks the credentials and issues the token, and this API
verifies that token on every protected request.

## Tech stack

- Next.js 15 (App Router route handlers)
- Supabase Auth (`@supabase/supabase-js`)
- Swagger UI (`swagger-ui-react`) served from an OpenAPI 3.0 spec

## Getting started

### 1. Prerequisites

- Node.js 18 or newer
- A free Supabase account

### 2. Create a Supabase project

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **Project Settings -> API** and copy your **Project URL** and **anon /
   publishable key**.
3. Go to **Authentication -> Sign In / Providers -> Email** and turn **off**
   "Confirm email", then save.

   This last step matters. If it stays on, every new user must click a link in
   their inbox before they can log in, and `/auth/login` will keep returning
   `401` while you are testing.

### 3. Set up environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

Your `.env` should look like this:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your_anon_key
PORT=3000
```

`.env` is listed in `.gitignore`, so your keys are never pushed to GitHub.
Only `.env.example` (which holds placeholders) is committed.

### 4. Install and run

```bash
npm install
```

```bash
npm run dev
```

The server starts on http://localhost:3000 and logs:

```
Server running and connected to Supabase
```

## API reference

Base URL: `http://localhost:3000`

| Method | Endpoint               | Purpose                          | Auth required |
| ------ | ---------------------- | -------------------------------- | ------------- |
| POST   | `/auth/signup`         | Create a new user account        | No            |
| POST   | `/auth/login`          | Log in and receive a JWT         | No            |
| POST   | `/auth/logout`         | End the user session             | Yes           |
| GET    | `/public/info`         | Read public data                 | No            |
| GET    | `/protected/profile`   | Read your private profile        | Yes           |
| GET    | `/protected/dashboard` | Read your private dashboard data | Yes           |

Protected endpoints expect the token in the request header:

```
Authorization: Bearer <access_token>
```

### Status codes

| Code  | When it happens                                          |
| ----- | -------------------------------------------------------- |
| `200` | Request succeeded                                         |
| `201` | User account created                                      |
| `204` | Logged out successfully (no content returned)             |
| `400` | Missing email or password, or Supabase rejected the input |
| `401` | Token missing, invalid or expired; or wrong credentials   |

## Try it in 60 seconds

Sign up:

```bash
curl -i -X POST http://localhost:3000/auth/signup -H "Content-Type: application/json" -d "{\"email\":\"you@gmail.com\",\"password\":\"password123\"}"
```

Log in and copy the `access_token` from the response:

```bash
curl -i -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"you@gmail.com\",\"password\":\"password123\"}"
```

Open the protected route with that token:

```bash
curl -i http://localhost:3000/protected/profile -H "Authorization: Bearer PASTE_TOKEN_HERE"
```

Without the token, the same route returns `401`:

```bash
curl -i http://localhost:3000/protected/profile
```

## API docs (Swagger UI)

With the server running, open **http://localhost:3000/docs**

![Swagger UI showing the API endpoints and the Authorize button](docs/swagger-ui.png)

Protected routes show a padlock icon. To test them in the browser:

1. Run `POST /auth/signup`, then `POST /auth/login`.
2. Copy the `access_token` from the login response.
3. Click the green **Authorize** button, paste the token, click **Authorize**,
   then **Close**. The padlocks switch to locked.
4. Open `GET /protected/profile` -> **Try it out** -> **Execute**.
   You get `200` and your user details.

## How the auth flow works

1. The client sends email and password to `/auth/signup` or `/auth/login`.
2. This API passes them to Supabase, which verifies them and returns a JWT.
3. The client sends that JWT back on every protected request, in the
   `Authorization: Bearer <token>` header.
4. `requireAuth()` in `lib/auth.js` verifies the token with Supabase before the
   route runs, so invalid or expired tokens never reach the route logic.

## Project structure

```
app/
  auth/signup/route.js          POST /auth/signup
  auth/login/route.js           POST /auth/login
  auth/logout/route.js          POST /auth/logout
  public/info/route.js          GET  /public/info
  protected/profile/route.js    GET  /protected/profile
  protected/dashboard/route.js  GET  /protected/dashboard
  docs/page.js                  Swagger UI at /docs
lib/
  supabase.js                   Shared Supabase client
  auth.js                       requireAuth guard for protected routes
public/
  openapi.json                  OpenAPI spec that Swagger UI reads
instrumentation.js              Startup check and log message
```

The guard lives in one file. Adding another protected route takes two lines:

```js
const { user, error } = await requireAuth(request);
if (error) return error;
```

## Note on logout

`POST /auth/logout` revokes the session's refresh token, so the session cannot be
renewed. The access token itself stays valid until it expires (about one hour),
which is standard JWT behaviour rather than a bug.
