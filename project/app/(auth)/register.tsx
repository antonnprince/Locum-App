import { View, Text, ScrollView, TouchableOpacity, TextInput,Image  } from 'react-native'
import React,{ useState } from 'react';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import {stateMedicalCouncils} from "../../constants/councils"
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '@/utils/supabase';
import Toast from "react-native-toast-message";
import DateTimePicker from '@react-native-community/datetimepicker';
import Loader from '../components/Loader';
import * as FileSystem from 'expo-file-system';




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
  const[clinicName, setClinicName] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [show, setShow] = useState<Boolean>(false);
  const [loading,setLoading] = useState<boolean>(false)
  
  const router = useRouter()

  type userRole = 'physician' | 'clinic'

  
const uploadPDFs = async (files: DocumentPicker.DocumentPickerAsset[], physicianId: string | undefined) => {
  try {
    for (const file of files) {
      if (!file || !file.uri || !physicianId) continue;

      const filePath = `${physicianId}/${file.name}`;

      // Read file as base64
      const fileData = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { data, error } = await supabase
        .storage
        .from('physicians')
        .upload(filePath, fileData, {
          contentType: 'application/pdf',   // important
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading ${file.name}:`, error.message);
        continue;
      }
    }
  } catch (error) {
    console.error('Error uploading PDFs:', error);
  }
};
  

  const physicianRegister = async (e: string, p: string) : Promise<void> => {
    setLoading(true)
    if(!email.trim() || !name.trim() || !phone.trim() || !council.trim() || !registrationNumber || !mbbs
    ||! cv ||!password ||!confirmpw
    || !medicalRegistrationDoc
    || !aadharCard )
    {
      setLoading(false)
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
      setLoading(false)
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
      setLoading(false)
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
    else if(phone.length!=10)
    {
      setLoading(false)
      Toast.show({
        type: "error",  // type of toast ('success', 'error', 'info', etc.)
        position: "top",  // position of the toast ('top', 'bottom', 'center')
        text1: "Invalid Phone Number!",  // main message text
        text2: "Make sure the phone number is valid and try again",  // secondary text (optional)
        visibilityTime: 3000,  // time to display the toast (in milliseconds)
        autoHide: true,  // auto hide after some time
      });
      return    
    }
    
    else
    { 
      const { data:result, error:err } = await supabase
          .from('physicians')
          .select('email')
          .eq('email', email);

        if (result && result.length > 0) {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Email already exists!",
            text2: "Please use a different email address",
            visibilityTime: 3000,
            autoHide: true,
          });
          setLoading(false);
          return;
        }

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
          reg_date: registrationDate,
          phone_no: phone,
         }

        ]
      )

      uploadPDFs([mbbs, cv, medicalRegistrationDoc, aadharCard], data?.user?.id)

      setLoading(false)
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
        console.log(error)
        Toast.show({
          type: "error",  // type of toast ('success', 'error', 'info', etc.)
          position: "top",  // position of the toast ('top', 'bottom', 'center')
          text1: "Error",  // main message text
          text2: error.message,  // secondary text (optional)
          visibilityTime: 3000,  // time to display the toast (in milliseconds)
          autoHide: true,  // auto hide after some time
        });
        console.log("Error:", error.message, error);    
        setLoading(false) 
      }
    }
    
  };

 const clinicRegister = async (e: string, p: string) : Promise<void> => {
  setLoading(true)
  if(!email.trim() || !clinicName.trim() || !address.trim())
  {
    setLoading(false)
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
    setLoading(false)
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
    setLoading(false)
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
    const { data:result, error:err } = await supabase
        .from('clinic')
        .select('email')
        .eq('email', email);

      if (result && result.length > 0) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Email already exists!",
          text2: "Please use a different email address",
          visibilityTime: 3000,
          autoHide: true,
        });
        setLoading(false);
        return;
      }

    const { data, error } = await supabase.auth.signUp({
      email:e,
      password:p,
    });
  
    if (data) {
      const {data:result, error} = await supabase.from('clinic').insert([
       { 
        clinic_id:data?.user?.id,
        name: clinicName,
        email: email,
        address: address, 
       }

      ]
    )

    setLoading(false)
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
      console.log(error)
      Toast.show({
        type: "error",  // type of toast ('success', 'error', 'info', etc.)
        position: "top",  // position of the toast ('top', 'bottom', 'center')
        text1: "Error",  // main message text
        text2: error.message,  // secondary text (optional)
        visibilityTime: 3000,  // time to display the toast (in milliseconds)
        autoHide: true,  // auto hide after some time
      });
      console.log("Error:", error.message, error);    
      setLoading(false) 
    }
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

          {
            role === 'physician' ?
            <>
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

              <TouchableOpacity
                onPress={() => setShow(true)}
                className='rounded-lg '>
                <Text className='font-bold'>Click to choose Registration Date</Text>
                  {
                    show &&
                      <DateTimePicker
                      value={registrationDate}
                      mode="date"  // 'date' | 'time' | 'datetime'
                      display="calendar"  // default, spinner, calendar, clock
                      onChange={(event, selectedDate) => {
                        setShow(false);
                        if (selectedDate) {
                          setRegistrationDate(selectedDate);
                          console.log( typeof selectedDate," :", selectedDate);
                        
                        }}
                      }
                    />
                  }
                  {
                    registrationDate &&
                    <Text className='text-sm mb-4 w-full'>{registrationDate.toLocaleDateString()}<Text className='text-green-500'> ✔</Text></Text>
                  }
            </TouchableOpacity>
              

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
                disabled={loading}
                onPress= {()=>physicianRegister(email, password)}
              className=' py-2 px-4 mx-auto my-2 w-full font-semibold bg-blue-600 rounded-lg'
              >
                <Text className='text-center font-bold text-white text-xl'>Register</Text>
              </TouchableOpacity>
            </> :
            <>
             <Text className='font-bold'>Clinic Name</Text>
              <TextInput 
              value={clinicName}
              onChangeText={(text)=>setClinicName(text)}
              className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />
            
            <Text className='font-bold'>Address</Text>
              <TextInput 
              value={address}
              onChangeText={(text)=>setAddress(text)}
              className='h-10 w-full border border-stone-400 rounded-lg mb-4 focus:outline-none p-2' />

              <TouchableOpacity
                disabled={loading}
                onPress= {()=>clinicRegister(email, password)}
              className=' py-2 px-4 mx-auto my-2 w-full font-semibold bg-blue-600 rounded-lg' >
                <Text className='text-center font-bold text-white text-xl'>Register</Text>  
              </TouchableOpacity>
            </>
          }


            {
              loading && 
              <Loader/>
            }


    </View>
    </ScrollView>
  )
}


export default Register