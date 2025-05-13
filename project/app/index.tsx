import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import "./global.css";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import { Image } from "react-native";
import Loader from "./components/Loader";
import { useAuth } from "@/hooks/useSessionContext";
// import loaderComponent from "../assets/loader.svg"


export default function Index() {
 const {session, loading} = useAuth()

  if (loading) {
    return(
      <Loader/>
    )
  }
    if (session) {
    return <Redirect href="/profiles" />;
  } else 
  {
    return <Redirect href="/login" />;
  }

}
