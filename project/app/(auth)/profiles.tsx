import React from 'react'
import { supabase } from '@/utils/supabase';


const profiles = () => {
    async function handleSignOut() {
      const { error } = await supabase.auth.signOut();
    
      if (error) {
        console.error('Sign out error:', error.message);
      } else {
        console.log('User signed out successfully!');
        // Optionally redirect to login screen or show a message
      }
    }
  return (
    <div>profiles</div>
  )
}

export default profiles