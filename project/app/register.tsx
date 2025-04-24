import { View, Text, ScrollView, TouchableOpacity, TextInput,Alert } from 'react-native'
import React,{ useState } from 'react';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import {stateMedicalCouncils} from "../constants/councils"
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '@/utils/supabase';

// TO DO
// ADD USER TO SUPABASE
// CREATE STRUCTURED FOLDER FOR NAVIGATION


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

  const showPasswordAlert = ():void => {
    if(!email.trim() || !name.trim() || !phone.trim() || !council.trim() || !registrationNumber || !mbbs
    ||! cv ||!password ||!confirmpw
    || !medicalRegistrationDoc
    || !aadharCard )
    {
    Alert.alert(
      "All fields are mandatory!",
      "Please fill all fields and try again",
      [
        {
          text: "Cancel",
          onPress: ()=>{},
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: ()=>{} 
        }
      ],
      { cancelable: false }
    );
   }
   else if(password.trim()!=confirmpw.trim())
    Alert.alert(
      "Passwords do not match!",
      "Make sure passwords match and try again",
      [
        {
          text: "Cancel",
          onPress: ()=>{},
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: ()=>{} 
        }
      ],
      { cancelable: false }
    );
    else{
      Alert.alert(
        "Successfully registered on MediShift!"
      )
    }
  }


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

  const userReg = async (email: string, password: string) => {
    // console.log(email +" " +typeof email, password+" "+typeof password)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (data) {
      console.log("Login Success:", data);
    } else if (error) {
      console.error("Login Error:", error.message, error);
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
            <Text className='font-medium text-blue-600 text-center '>
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
          onChangeText={(text)=>{setEmail(text), console.log(text)}}
          className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />

          <Text className='font-bold'>Password</Text>
          <TextInput 
          value={password}
          onChangeText={(text)=>setPassword(text)}
          className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />

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
            onPress={() => {
              userReg(email, password);
            }}
          className=' py-2 px-4 mx-auto my-2 w-full font-semibold bg-blue-600 rounded-lg'
          >
            <Text className='text-center font-bold text-white text-xl'>Register</Text>
          </TouchableOpacity>

    </View>
    </ScrollView>
  )
}


export default Register