import React, { useEffect,useState } from 'react'
import { supabase } from '@/utils/supabase';
import { View, Text, TouchableOpacity } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'expo-router';



const profiles = () => {

  const [session, setSession] = useState<Session | null>(null)

useEffect(()=>{
  supabase.auth.getSession().then(
   ( {data:{session}})=>setSession(session)
  )
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  return () => {
    listener.subscription.unsubscribe(); // clean up auth listener!
  }

},[])
  
const router = useRouter()

  async function handleSignOut() {
      const { error } = await supabase.auth.signOut();
    
      if (error) {
        console.error('Sign out error:', error.message);
      } else {
        console.log('User signed out successfully!');
          router.push('/login')
      }
    }


  return (
    <div>
      profiles
        <TouchableOpacity
        onPress={handleSignOut}
        className=' py-2 px-4 mx-auto my-2 w-full font-semibold bg-blue-600 rounded-lg'>
        <Text className='text-center font-bold text-white text-lg'>Sign Out</Text>
        
        </TouchableOpacity>
    </div>
  )
}

export default profiles