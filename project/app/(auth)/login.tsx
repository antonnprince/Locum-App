import React,{useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity,TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
import Toast from 'react-native-toast-message';
import Loader from '../components/Loader';

const Login = () => {

  const router = useRouter()
    const[email, setEmail] = useState<string>('')
    const[password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState(false)


  const handleLogin = async (email:string, password:string) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {
      setLoading(false)
      Toast.show({
                type: "error",  // type of toast ('success', 'error', 'info', etc.)
                position: "top",  // position of the toast ('top', 'bottom', 'center')
                text1: error.message,  // main message text
                text2: "Try again",  // secondary text (optional)
                visibilityTime: 3000,  // time to display the toast (in milliseconds)
                autoHide: true,  // auto hide after some time
              })

    } 
    else {
      router.push('/profiles')
     }
  }


    return (
     <ScrollView
        showsVerticalScrollIndicator={false}
        >
        <View className='flex-1 flex-col m-4  py-24'>
          <Text>
          ♡
          </Text>
        <Text className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                 Sign In To Your Account
                </Text>
                <Text className=" mx-auto text-center text-sm text-gray-600 font-bold">
                  Or
                </Text>
                <TouchableOpacity 
                  onPress={()=>router.push('/register')}>
                    <Text className='font-extrabold text-blue-600 text-center mb-12'>
                      Create New Account
                    </Text>    
                </TouchableOpacity>

                     <Text className='font-bold'>Email address</Text>
                      <TextInput 
                      value={email}
                      onChangeText={(text)=>setEmail(text)}
                      className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />
            
                      <Text className='font-bold'>Password</Text>
                      <TextInput 
                      value={password}
                      onChangeText={(text)=>setPassword(text)}
                      className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />

                      <TouchableOpacity
                      onPress={()=>{handleLogin(email,password)}}
                    className=' py-2 px-4 mx-auto my-2 w-full font-semibold bg-blue-600 rounded-lg'
                    >
                      <Text className='text-center font-bold text-white text-xl'>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                    onPress={()=>router.push('/adminLogin')}
                    className='bg-[#d6d3d1] w-fit mx-auto my-4 py-2 px-4 rounded-lg'>
                      <Text className='text-[#8a0194] font-semibold text-center'>
                      <Text className='text-2xl px-2'>
                      ⛉
                        </Text> Admin Login
                      </Text>
                    </TouchableOpacity>
                    {
                      loading && ( <Loader />)

                    }
    </View>
    </ScrollView>
  );
};

export default Login
