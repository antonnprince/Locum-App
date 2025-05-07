import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import "./global.css";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import { Image } from "react-native";
import Loader from "./components/Loader";


export default function Index() {
  const [session, setSession] = useState<Session | null | undefined>(undefined); // <-- notice undefined initially
  const [loading, setLoading] = useState(true);


  useEffect(() => { 

    setLoading(true);
    supabase.auth.getSession().then(
     
      ( { data: { session } }) => {
      setSession(session);
      }
    )
    setLoading(false);
    
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe(); // clean up auth listener!
    }
  }, []);

      if (loading) {
        return(
          <Loader/>
        )
      }
       if (session) {
        return <Redirect href="/profiles" />;
      } else {
        return <Redirect href="/login" />;
      }
}
