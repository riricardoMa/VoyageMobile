# VoyageMobile

A modern Expo + React Native app using Supabase Auth, TypeScript, and Bun as the runtime and package manager.

## Features

- Email/password authentication (Supabase)
- Secure session storage (MMKV + SecureStore)
- SOLID-compliant architecture (hooks, context, separation of concerns)
- TypeScript-first
- Bun for fast installs and scripts

## Getting Started

1. Install dependencies:
   ```sh
   bun install
   ```
2. Set up your `.env` file with your Supabase project URL and anon key.
3. Run the app with Expo (see Expo docs for Bun integration).

## Structure

- `app/` — source code
  - `services/auth/` — authentication logic, context, hooks
  - `utils/storage/` — secure session storage
  - `screens/` — UI screens (SignIn, Welcome, etc.)

## Auth Flow

- Sign up, sign in, sign out
- Secure session persistence
- Error handling and validation

---

MIT License
