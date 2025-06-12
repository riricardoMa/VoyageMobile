import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  PropsWithChildren,
} from "react";
import { supabase, Session } from "./supabase";

interface AuthContextType {
  isAuthenticated: boolean;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithOtp: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) setError(error.message);
    setLoading(false);
  }, []);

  const signInWithOtp = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session,
        session,
        loading,
        error,
        signInWithGoogle,
        signInWithOtp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
