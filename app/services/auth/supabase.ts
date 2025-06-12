import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";
import * as SessionStorage from "@utils/storage/SessionStorage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SessionStorage,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener("change", (nextAppState) => {
  if (nextAppState === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export type { Session, AuthError } from "@supabase/supabase-js";
