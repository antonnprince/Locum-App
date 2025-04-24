import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
const Login = () => {

  const router = useRouter()
  return (
    <View style={styles.container}>
      <TouchableOpacity
      onPress={()=>router.push('/register')}
      >
      <Text
      >Login Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
