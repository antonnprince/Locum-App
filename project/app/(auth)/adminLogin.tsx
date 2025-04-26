import React,{useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity,TextInput } from 'react-native';
import { useRouter } from 'expo-router';
const Login = () => {

  const router = useRouter()
    const[email, setEmail] = useState<string>('')
    const[password, setPassword] = useState<string>('')
    const [securityCode, setSecurityCode] = useState<string>('')

    return (
     <ScrollView
        showsVerticalScrollIndicator={false}
        >
        <View className='flex-1 flex-col m-4  py-24'>
        <Text className='text-5xl px-2 text-[#a800b7] text-center font-extrabold '>
                        ⛉
                    </Text> 
        <Text className="mt-6 text-black text-center text-4xl font-extrabold text-gray-900">
                    
                    Admin Portal Login
                </Text>
                <Text className=" mx-auto text-center text-sm text-gray-600 mb-12 font-bold">
                  Authorized personnel only
                </Text>
            

                     <Text className='font-bold'>Admin Email</Text>
                      <TextInput 
                      value={email}
                      onChangeText={(text)=>setEmail(text)}
                      className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />
            
                      <Text className='font-bold'>Admin Password</Text>
                      <TextInput 
                      value={password}
                      onChangeText={(text)=>setPassword(text)}
                      className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />
                     
                     <Text className='font-bold'>Admin Security Code</Text>
                      <TextInput 
                      value={securityCode}
                      onChangeText={(text)=>setSecurityCode(text)}
                      className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />

                      <TouchableOpacity
                      onPress={()=>{}}
                    className=' py-2 px-4 mx-auto bg-[#a800b7] my-2 w-full font-semibold bg-blue-600 rounded-lg'
                    >
                      <Text className='text-center font-bold text-white text-lg'>Sign In As Admin</Text>
                    </TouchableOpacity>

                   
    </View>
    </ScrollView>
  );
};

export default Login;
