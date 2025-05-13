import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";


interface AuthContextType {
  session: Session | null;
  loading: boolean;
  fetchSession: () => Promise<void>;
}

 
const AuthContext = createContext<AuthContextType | null>(null);  

 
interface AuthProviderProps {
  children: ReactNode;
}


export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);


  const fetchSession = async () => {
    setLoading(true);

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) console.error("Error fetching session:", error);
    setSession(session);

    setLoading(false);
  };

  useEffect(() => {
    fetchSession(); 

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const refreshInterval = setInterval(async () => {
      console.log("Refreshing session...");
      await supabase.auth.refreshSession();
    }, 60 * 1000);

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


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
