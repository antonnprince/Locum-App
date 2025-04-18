import { View, Text, ScrollView, TouchableOpacity, TextInput,Button } from 'react-native'
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import {stateMedicalCouncils} from "../constants/councils"
import * as DocumentPicker from 'expo-document-picker';


export default function Register() {

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

  const onRoleChange = (newRole: userRole) => {
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
        <Text className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <TouchableOpacity 
          onPress={()=>router.push('/login')}>
            <Text className='font-medium text-blue-600 hover:text-blue-500 mb-8'>
              sign in to your existing account
            </Text>
            
            </TouchableOpacity>
          </Text>

          <View className="flex rounded-md shadow-sm mb-6">
          <TouchableOpacity
              onPress={() => onRoleChange('physician')}
              className={`flex-1 py-2 px-4 w-1/2 text-center text-sm font-medium rounded-r-md ${
                role === 'physician'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
             <Text
             className='text-center text-sm font-medium'
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
          {mbbs && <Text className='text-md mb-4'>{mbbs.name}</Text>}

          <Text className='font-bold'>Upload CV</Text>
            <TouchableOpacity
            className='border-stone-400 rounded-lg focus:outline-none'
           onPress={() => pickDocument(setCv)} >
                        <Text className='border border-stone-400 self-start px-2 py-1 rounded-lg'>Browse ➤</Text>
            </TouchableOpacity>
          {cv && <Text  className='text-md mb-4'>{cv.name}</Text>}

          <Text className='font-bold'>Upload Registration Document</Text>
          <TouchableOpacity
            className='border-stone-400 rounded-lg focus:outline-none'
           onPress={() => pickDocument(setMedicalRegistrationDoc)} >
            <Text className='border border-stone-400 self-start px-2 py-1 rounded-lg'>Browse ➤</Text>
            </TouchableOpacity>
          {medicalRegistrationDoc && <Text  className='text-md mb-4'>{medicalRegistrationDoc.name}</Text>}

          <Text className='font-bold'>Upload Aadhaar Card</Text>
          <TouchableOpacity
            className='border-stone-400 rounded-lg focus:outline-none'
           onPress={() => pickDocument(setAadharCard)} >
            <Text className='border border-stone-400 self-start px-2 py-1 rounded-lg'>Browse ➤</Text>
            </TouchableOpacity>
          {aadharCard && <Text  className='text-md mb-4'>{aadharCard.name}</Text>}

    </View>
    </ScrollView>
  )
}