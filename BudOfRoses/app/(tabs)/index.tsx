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
  Image,
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
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const LoginScreen = () => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

const {
  control,
  handleSubmit,
  setValue,
  reset,
  formState: { errors },
} = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleLogin = async ({ username, password }: { username: string; password: string }) => {
    setLoading(true);

    if (username === 'Admin_01' && password === 'iamtheadmin') {
      setLoading(false);
      reset();
      router.push('/productList');
      return;
    }

    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'users'));

      if (snapshot.exists()) {
        const users = snapshot.val() as { [key: string]: any };

        const matchedUser = Object.values(users).find(
          (user: any) => user.username === username && user.password === password
        );

        if (matchedUser) {
          setLoading(false);
          reset();
          router.push({ pathname: '/userProductList', params: { username } });
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

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Image
        source={require('../../assets/images/budlogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>Please sign in to your account</Text>

      {/* Username */}
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#aaa"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

      {/* Password */}
      <View style={styles.passwordContainer}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry={secureTextEntry}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Ionicons name={secureTextEntry ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity onPress={() => router.push('/forgotPass')}>
          <Text style={styles.forgotLink}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleSubmit(handleLogin)}
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
    backgroundColor: '#D9D3C3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    borderColor: '#4B3130',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 5,
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
    marginBottom: 5,
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
    marginBottom: 15,
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
  error: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    padding: 10,
    justifyContent: 'center',
  },
  forgotLink: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#4B3130',
    textDecorationLine: 'none',
  },
});

export default LoginScreen;
