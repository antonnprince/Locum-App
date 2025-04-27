import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import "./global.css";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import { Image, Text } from "react-native";

// import loaderComponent from "../assets/loader.svg"


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
          <Image
          source={require('../assets/loader.png')}
           style={{ width: "50%", height: "50%",
              position: "absolute",
               justifyContent: "center",
               marginTop: "50%",
               alignSelf: "center", flex:1}}
              resizeMode="contain"
            
            className="animate-spin"
        />
        
        )
      }
       if (session) {
        return <Redirect href="/profiles" />;
      } else {
        return <Redirect href="/login" />;
      }
}
