import React from 'react'
import { Stack } from 'expo-router'

const layout = () => {
  return (
    <Stack
    // initialRouteName="/login"
        screenOptions={{headerShown:false}}
    />
  )
}

export default layout