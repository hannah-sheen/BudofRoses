import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const handleLogin = () => {
    console.log('logged')
    if (username === 'user' && password === 'user') {
      setUsername('')
      setPassword('')
      router.push('/(tabs)/userProductList');
    } else {
      Alert.alert(
        'Login Failed',
        'Invalid username or password',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Welcome back!</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Username Field */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#A78A8A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#A78A8A"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#A78A8A" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#A78A8A"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
            />
            <TouchableOpacity
              onPress={() => setSecureTextEntry(!secureTextEntry)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#A78A8A"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Option */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBA6B6',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_600SemiBold',
    color: '#4B3130', // Changed to dark brown
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#4B3130', // Changed to dark brown
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(75, 49, 48, 0.1)', // Using #4B3130 with opacity
    borderColor: '#4B3130', // Added border
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
    color: '#4B3130', // Changed to dark brown
  },
  input: {
    flex: 1,
    height: 50,
    color: '#4B3130', // Changed to dark brown
    fontFamily: 'Poppins_400Regular',
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#4B3130', // Changed to dark brown
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4B3130', // Added shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF', // Changed to white for contrast
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    letterSpacing: 1, // Added spacing to ensure "Login" shows fully
    width: '100%',
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#4B3130', // Changed to dark brown
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  signupLink: {
    color: '#4B3130', // Changed to dark brown
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;