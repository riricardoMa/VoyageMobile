# VoyageMobile

A modern Expo + React Native app using Supabase Auth, TypeScript, NativeWind, and Bun as the runtime and package manager.

## Features

- Email/password authentication (Supabase)
- Secure session storage (MMKV + SecureStore)
- SOLID-compliant architecture (hooks, context, separation of concerns)
- TypeScript-first
- NativeWind for Tailwind CSS styling
- Reusable UI components
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
  - `components/` — reusable UI components with NativeWind styling

## Auth Flow

- Sign up, sign in, sign out
- Secure session persistence
- Error handling and validation

## Styling with NativeWind

This app uses NativeWind for styling, which brings Tailwind CSS to React Native. Key features:

- **Utility-first CSS**: Use Tailwind classes directly in your JSX
- **Responsive design**: Built-in responsive utilities
- **Custom components**: Reusable components with consistent styling
- **TypeScript support**: Full type safety for className props

### Example Usage

```tsx
// Basic styling
<View className="flex-1 justify-center items-center bg-white p-6">
  <Text className="text-2xl font-bold text-gray-900 mb-4">
    Hello World
  </Text>
</View>

// Using custom components
<Button
  title="Sign In"
  onPress={handleSignIn}
  variant="primary"
  size="lg"
/>
```

### Configuration Files

- `tailwind.config.js` — Tailwind CSS configuration
- `metro.config.js` — Metro bundler configuration for NativeWind
- `global.css` — Global Tailwind styles
- `nativewind-env.d.ts` — TypeScript declarations

---

MIT License
