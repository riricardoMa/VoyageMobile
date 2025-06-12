# VoyageMobile

A modern Expo + React Native app using Supabase Auth, TypeScript, and npm as the package manager.

## Features

- Email/password authentication (Supabase)
- Secure session storage (MMKV + SecureStore)
- SOLID-compliant architecture (hooks, context, separation of concerns)
- TypeScript-first
- npm for package management

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your `.env` file with your Supabase project URL and anon key.
3. Run the app with Expo.

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
