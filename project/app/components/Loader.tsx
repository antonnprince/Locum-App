import React from 'react'
import { Image } from 'react-native'

const Loader = () => {
  return (
     <Image
                           source={require('../../assets/loader.png')}
                            style={{ width: "50%", height: "50%",
                               position: "absolute",
                                justifyContent: "center",
                                marginTop: "50%",
                                alignSelf: "center", flex:1}}
                               resizeMode="contain"
                               className='animate-spin'
                         />
  )
}

export default Loader