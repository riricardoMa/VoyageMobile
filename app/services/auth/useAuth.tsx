import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
  type PropsWithChildren,
} from "react";
import * as SecureStore from "expo-secure-store";
import { supabase, type Session } from "@services/auth/supabase";

// Auth state interface
interface AuthState {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
  session: Session | null;
  error: string | null;
  loading: boolean;
}

// Auth actions
type AuthAction =
  | { type: "RESTORE_TOKEN"; token: string | null; session: Session | null }
  | { type: "SIGN_IN"; token: string; session: Session }
  | { type: "SIGN_OUT" }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null };

// Auth context type
interface AuthContextType {
  // State
  isAuthenticated: boolean;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isLoading: boolean;
  isSignout: boolean;

  // Actions
  signInWithOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth reducer
function authReducer(prevState: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...prevState,
        userToken: action.token,
        session: action.session,
        isLoading: false,
      };
    case "SIGN_IN":
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
        session: action.session,
        error: null,
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
        session: null,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...prevState,
        loading: action.loading,
      };
    case "SET_ERROR":
      return {
        ...prevState,
        error: action.error,
      };
    default:
      return prevState;
  }
}

// Initial state
const initialState: AuthState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  session: null,
  error: null,
  loading: false,
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Token restoration effect
  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken: string | null = null;
      let session: Session | null = null;

      try {
        // Try to get token from SecureStore
        userToken = await SecureStore.getItemAsync("userToken");

        // Get current session from Supabase
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        session = currentSession;

        // If we have a session but no stored token, store the token
        if (session?.access_token && !userToken) {
          userToken = session.access_token;
          await SecureStore.setItemAsync("userToken", userToken);
        }

        // If we have a stored token but no session, clear the stored token
        if (userToken && !session) {
          await SecureStore.deleteItemAsync("userToken");
          userToken = null;
        }
      } catch (error) {
        // Restoring token failed
        console.warn("Failed to restore authentication token:", error);
        try {
          await SecureStore.deleteItemAsync("userToken");
        } catch (deleteError) {
          console.warn("Failed to delete invalid token:", deleteError);
        }
      }

      // This will switch to the App screen or Auth screen
      dispatch({ type: "RESTORE_TOKEN", token: userToken, session });
    };

    bootstrapAsync();
  }, []);

  // Auth state change listener
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Store token securely
        await SecureStore.setItemAsync("userToken", session.access_token);
        dispatch({
          type: "SIGN_IN",
          token: session.access_token,
          session,
        });
      } else if (event === "SIGNED_OUT") {
        // Remove stored token
        try {
          await SecureStore.deleteItemAsync("userToken");
        } catch (error) {
          console.warn("Failed to remove token:", error);
        }
        dispatch({ type: "SIGN_OUT" });
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // Auth context value with memoized actions
  const authContext = useMemo(
    () => ({
      // State
      isAuthenticated: !!state.session,
      session: state.session,
      loading: state.loading,
      error: state.error,
      isLoading: state.isLoading,
      isSignout: state.isSignout,

      // Actions
      signInWithOtp: async (email: string) => {
        dispatch({ type: "SET_LOADING", loading: true });
        dispatch({ type: "SET_ERROR", error: null });

        try {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: true,
            },
          });

          if (error) {
            dispatch({ type: "SET_ERROR", error: error.message });
          }
        } catch (error) {
          dispatch({
            type: "SET_ERROR",
            error: error instanceof Error ? error.message : "An error occurred",
          });
        } finally {
          dispatch({ type: "SET_LOADING", loading: false });
        }
      },

      verifyOtp: async (email: string, token: string) => {
        dispatch({ type: "SET_LOADING", loading: true });
        dispatch({ type: "SET_ERROR", error: null });

        try {
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: "email",
          });

          if (error) {
            dispatch({ type: "SET_ERROR", error: error.message });
          } else if (data.session) {
            // The auth state change listener will handle the SIGN_IN action
            await SecureStore.setItemAsync(
              "userToken",
              data.session.access_token
            );
          }
        } catch (error) {
          dispatch({
            type: "SET_ERROR",
            error: error instanceof Error ? error.message : "An error occurred",
          });
        } finally {
          dispatch({ type: "SET_LOADING", loading: false });
        }
      },

      signOut: async () => {
        dispatch({ type: "SET_LOADING", loading: true });
        dispatch({ type: "SET_ERROR", error: null });

        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            dispatch({ type: "SET_ERROR", error: error.message });
          }
          // The auth state change listener will handle the SIGN_OUT action
        } catch (error) {
          dispatch({
            type: "SET_ERROR",
            error: error instanceof Error ? error.message : "An error occurred",
          });
        } finally {
          dispatch({ type: "SET_LOADING", loading: false });
        }
      },

      signUp: async (email: string) => {
        // For this app, signUp is the same as signInWithOtp
        return authContext.signInWithOtp(email);
      },
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
