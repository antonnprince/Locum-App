import { Redirect } from "expo-router";
import "./global.css";
import Loader from "./components/Loader";
import { useAuth } from "@/hooks/useSessionContext";



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
