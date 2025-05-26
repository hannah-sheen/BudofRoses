import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { database } from './firebaseConfig';
import { ref, get, child } from 'firebase/database';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Missing Info', 'Please enter both username and password.');
      return;
    }

    setLoading(true);

    // Admin login
    if (username === 'Admin_01' && password === 'iamtheadmin') {
      setLoading(false);
      setUsername('');
      setPassword('');
      router.push('/productList');
      return;
    }

    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'users'));

      if (snapshot.exists()) {
        const users = snapshot.val() as { [key: string]: any };

        const matchedUser = Object.values(users).find(
          (user: any) =>
            user.username === username && user.password === password
        );

        if (matchedUser) {
          setLoading(false);
          setUsername('');
          setPassword('');
          alert('Welcome User!')
          // router.push('/'); // Replace with your actual route
        } else {
          setLoading(false);
          Alert.alert('Login Failed', 'Invalid username or password.');
        }
      } else {
        setLoading(false);
        Alert.alert('No Users', 'No registered users found.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Login Error:', error);
      Alert.alert('Error', 'An error occurred while logging in.');
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Please sign in to your account</Text>

      <TextInput style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setSecureTextEntry(!secureTextEntry)}
        >
          <Ionicons
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.signupLink}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBA6B6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    borderColor: '#4B3130',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#4B3130',
  },
  passwordContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderColor: '#4B3130',
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#4B3130',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4B3130',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  signupContainer: {
    flexDirection: 'row',
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#4B3130',
  },
  signupLink: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#4B3130',
  },
});

export default LoginScreen;
