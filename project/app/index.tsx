import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import "./global.css";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

export default function Index() {
  const [session, setSession] = useState<Session | null | undefined>(undefined); // <-- notice undefined initially

  useEffect(() => { 
    supabase.auth.getSession().then(
     
      ({ data: { session } }) => {
      setSession(session);
    }
  )

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe(); // clean up auth listener!
    }
  }, []);

  // --- handle loading first ---
  if (session === undefined) {
    return <h1>Session loading...</h1>; // or you can return a loading spinner
  }

  if (session) {
    return <Redirect href="/profiles" />;
  } else {
    return <Redirect href="/login" />;
  }
}
