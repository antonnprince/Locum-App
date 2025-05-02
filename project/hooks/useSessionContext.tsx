import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";

// 1. Define types for context
interface AuthContextType {
  session: Session | null;
  loading: boolean;
  fetchSession: () => Promise<void>;
}

// 2. Create context with proper type
const AuthContext = createContext<AuthContextType | null>(null); // Ensure this is correctly defined and used

// 3. Define props type for provider
interface AuthProviderProps {
  children: ReactNode;
}

// 4. AuthProvider with correct types
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserDetails = async() : Promise<void>=>{
    setSession(null)
  }
  const fetchSession = async () => {
    setLoading(true);

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) console.error("Error fetching session:", error);
    setSession(session);

    setLoading(false);
  };

  useEffect(() => {
    fetchSession(); // Fetch on app load

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const refreshInterval = setInterval(async () => {
      console.log("Refreshing session...");
      await supabase.auth.refreshSession();
    }, 15 * 60 * 1000);

    return () => {
      authListener.subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, fetchSession }}>
      {children}
    </AuthContext.Provider>
  );
}

// 5. useAuth hook with proper typing
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
