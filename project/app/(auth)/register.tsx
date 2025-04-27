import { View, Text, ScrollView, TouchableOpacity, TextInput,Alert } from 'react-native'
import React,{ useState } from 'react';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import {stateMedicalCouncils} from "../../constants/councils"
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '@/utils/supabase';
import Toast from "react-native-toast-message";

// TO DO

// Store pdfs in bucket and save the url in the database




const Register:React.FC=()=> {
  const [role,setRole] = useState<string>('physician')
  const[email, setEmail] = useState<string>('')
  const[password, setPassword] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [confirmpw, setConfirmPw] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [registrationNumber, setRegistrationNumber] = useState<string>('')
  const [registrationDate, setRegistrationDate] = useState<Date>(new Date())
  const [mbbs, setMbbs] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [cv, setCv] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [medicalRegistrationDoc, setMedicalRegistrationDoc] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [aadharCard, setAadharCard] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [council, setCouncil] = useState<string>('')

  

  const router = useRouter()

  type userRole = 'physician' | 'clinic'


  const userReg = async (e: string, p: string) : Promise<void> => {
    if(!email.trim() || !name.trim() || !phone.trim() || !council.trim() || !registrationNumber || !mbbs
    ||! cv ||!password ||!confirmpw
    || !medicalRegistrationDoc
    || !aadharCard )
    {
      Toast.show({
        type: "error",  // type of toast ('success', 'error', 'info', etc.)
        position: "top",  // position of the toast ('top', 'bottom', 'center')
        text1: "All fields are mandatory!",  // main message text
        text2: "Fill all fields and try again",  // secondary text (optional)
        visibilityTime: 3000,  // time to display the toast (in milliseconds)
        autoHide: true,  // auto hide after some time
      });
      return
    }
    else if(password.length<6)
    {
      Toast.show({
        type: "error",  // type of toast ('success', 'error', 'info', etc.)
        position: "top",  // position of the toast ('top', 'bottom', 'center')
        text1: "Insufficient Length!",  // main message text
        text2: "Make sure the passwords have minimum length of 6 characters",  // secondary text (optional)
        visibilityTime: 3000,  // time to display the toast (in milliseconds)
        autoHide: true,  // auto hide after some time
      });
      return
    }
    else if(password.trim()!=confirmpw.trim())
    {
      Toast.show({
        type: "error",  // type of toast ('success', 'error', 'info', etc.)
        position: "top",  // position of the toast ('top', 'bottom', 'center')
        text1: "Password Mismatch!",  // main message text
        text2: "Make sure the passwords match and try again",  // secondary text (optional)
        visibilityTime: 3000,  // time to display the toast (in milliseconds)
        autoHide: true,  // auto hide after some time
      });
      return
    }

    else
    {
      const { data, error } = await supabase.auth.signUp({
        email:e,
        password:p,
      });
    
      if (data) {
        const {data:result, error} = await supabase.from('physicians').insert([
         { 
          id:data?.user?.id,
          name: name,
          email: email,
          state_medical_council: council,
          reg_no: registrationNumber,
          phone_no: phone,
         }

        ]
      )
        console.log("Physician data added to table:", result, error)
        // console.log("Registration Success:", data);
        Toast.show({
          type: "info",  // type of toast ('success', 'error', 'info', etc.)
          position: "top",  // position of the toast ('top', 'bottom', 'center')
          text1: "Verify Email",  // main message text
          text2: "Check your mail for verification to proceed further",  // secondary text (optional)
          visibilityTime: 3000,  // time to display the toast (in milliseconds)
          autoHide: true,  // auto hide after some time
        });
        
      } 
      else if (error) {
        Toast.show({
          type: "error",  // type of toast ('success', 'error', 'info', etc.)
          position: "top",  // position of the toast ('top', 'bottom', 'center')
          text1: "Error",  // main message text
          text2: error.message,  // secondary text (optional)
          visibilityTime: 3000,  // time to display the toast (in milliseconds)
          autoHide: true,  // auto hide after some time
        });
        console.error("Login Error:", error.message, error);
      }
    }
    
  };



  const onRoleChange = (newRole: userRole):void => {
    setRole(newRole);
    setEmail('')
    setPassword('')
    setConfirmPw('')
    setName('') 
    setMbbs(null);
    setCv(null);
    setMedicalRegistrationDoc(null);
    setAadharCard(null);
    setRegistrationNumber('')
  };

  const pickDocument = async (setter: Function) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf", // or pick MIME types like "application/pdf"
        copyToCacheDirectory: true,
        multiple: false
      });

      if (result?.assets?.[0]) {
        setter(result.assets[0]);
      }
    } catch (err) {
      console.warn("Document pick error:", err);
    }
  };

 

  return (
    <ScrollView
    showsVerticalScrollIndicator={false}
    >
    <View className='flex-1 flex-col m-4'>

        <Text className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </Text>
        <Text className=" mx-auto text-center text-sm text-gray-600 font-bold">
          Or
        </Text>
        <TouchableOpacity 
          onPress={()=>router.push('/login')}>
            <Text className='font-extrabold text-blue-600 text-center '>
              Sign in to your existing account
            </Text>    
        </TouchableOpacity>
          

          <View className="flex flex-row rounded-md shadow-sm my-4">
          <TouchableOpacity
              onPress={() => onRoleChange('physician')}
              className={`flex-1 py-2 px-4 w-1/2 text-center  font-semibold  ${
                role === 'physician'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
             <Text
             className='text-center text-sm'
             >I'm a Physician</Text> 
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() =>onRoleChange('clinic')}
              className={`flex-1 py-2 px-4 w-1/2  text-center text-sm font-medium rounded-r-md ${
                role === 'clinic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
             <Text
             className='text-center text-sm font-medium'
             >I'm a Clinic</Text> 
            </TouchableOpacity>
          </View>
     
          <Text className='font-bold'>Email address</Text>
          <TextInput 
          value={email}
          onChangeText={(text)=>setEmail(text)}
          className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />

          <Text className='font-bold'>Password</Text>
          <TextInput 
          value={password}
          onChangeText={(text)=>setPassword(text)}
          className='h-10 w-full border border-stone-400 rounded-lg focus:outline-none p-2' />
          <Text className=' mb-4 text-xs text-gray'>
            Password must be at least 6 characters long
          </Text>


          <Text className='font-bold'>Confirm Password</Text>
          <TextInput 
          value={confirmpw}
          onChangeText={(text)=>setConfirmPw(text)}
          className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />

          <Text className='font-bold'>Full Name</Text>
          <TextInput 
          value={name}
          onChangeText={(text)=>setName(text)}
          className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />

          <Text className='font-bold'>Phone Number</Text>
          {/* need to set regex for phone number */}
          <TextInput 
          value={phone}
          onChangeText={(text)=>setPhone(text)}
          className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />
          
          <Text className='font-bold'>State Medical Council</Text>
          <Picker 
            selectedValue={council}
            onValueChange={(itemValue) => setCouncil(itemValue)}
            className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2'
          >
            {
              stateMedicalCouncils.map((item, index)=>(
                  <Picker.Item 
                  key={index}
                  label={item}
                  value={item}
                  />
              ))
            }
            
          </Picker>

          <Text className='font-bold'>State Registration Number</Text>
          <TextInput 
          value={registrationNumber}
          onChangeText={(text)=>setRegistrationNumber(text)}
          className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />

          {/* <Text className='font-bold'>Registration Date</Text> */}
          
          

          <Text className='font-extrabold'>Upload MBBS Certificate (PDF only)</Text>
          <TouchableOpacity
          className='border-stone-400 rounded-lg focus:outline-none'
          onPress={() => pickDocument(setMbbs)}
          >
            <Text className='border border-stone-400 self-start px-2 py-1 rounded-lg'>Browse ➤</Text>
          </TouchableOpacity>
          {mbbs && <Text className='text-sm mb-4 w-full'>{mbbs.name} <Text className='text-green-500'> ✔</Text> </Text>}

          <Text className='font-bold'>Upload CV</Text>
            <TouchableOpacity
            className='border-stone-400 rounded-lg focus:outline-none'
           onPress={() => pickDocument(setCv)} >
                        <Text className='border border-stone-400 self-start px-2 py-1 rounded-lg'>Browse ➤</Text>
            </TouchableOpacity>
          {cv && <Text  className='text-sm mb-4 w-full'>{cv.name} <Text className='text-green-500'> ✔</Text></Text>}

          <Text className='font-bold'>Upload Registration Document</Text>
          <TouchableOpacity
            className='border-stone-400 rounded-lg focus:outline-none'
           onPress={() => pickDocument(setMedicalRegistrationDoc)} >
            <Text className='border border-stone-400 self-start px-2 py-1 rounded-lg'>Browse ➤</Text>
            </TouchableOpacity>
          {medicalRegistrationDoc && <Text  className='text-sm mb-4 w-full'>{medicalRegistrationDoc.name} <Text className='text-green-500'> ✔</Text></Text>}

          <Text className='font-bold'>Upload Aadhaar Card</Text>
          <TouchableOpacity
            className='border-stone-400 rounded-lg focus:outline-none'
           onPress={() => pickDocument(setAadharCard)} >
            <Text className='border border-stone-400 self-start px-2 py-1 rounded-lg'>Browse ➤</Text>
            </TouchableOpacity>
          {aadharCard && <Text  className='text-sm mb-4 w-full'>{aadharCard.name}<Text className='text-green-500'> ✔</Text></Text>}

          <TouchableOpacity
            // onPress={() => {
            //   userReg(email, password);
            // }}
            onPress= {()=>userReg(email, password)}
          className=' py-2 px-4 mx-auto my-2 w-full font-semibold bg-blue-600 rounded-lg'
          >
            <Text className='text-center font-bold text-white text-xl'>Register</Text>
          </TouchableOpacity>



    </View>
    </ScrollView>
  )
}


export default Register