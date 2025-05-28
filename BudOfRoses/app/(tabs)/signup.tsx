import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { database } from './firebaseConfig';
import { ref, set, get, child } from 'firebase/database';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Define validation schema
const signupSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  username: yup.string()
    .required('Username is required')
    .min(4, 'Username must be at least 4 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string()
    .required('ZIP code is required')
    .matches(/^\d{5}(?:[-\s]\d{4})?$/, 'Invalid ZIP code format'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Invalid phone number format'),
});

const CustomerSignupForm = () => {
  const router = useRouter();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
    },
  });

  // Load Poppins fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B3130" />
      </View>
    );
  }

  const onSubmit = async (data: any) => {
    setLoading(true);
    const dbRef = ref(database);

    try {
      const snapshot = await get(child(dbRef, 'users'));
      if (snapshot.exists()) {
        const users = snapshot.val() as { [key: string]: any };

        const usernameExists = Object.values(users).some(
          user => user.username === data.username
        );
        const emailExists = Object.values(users).some(
          user => user.email === data.email
        );

        if (usernameExists) {
          setLoading(false);
          alert('Username already exists. Please choose another.');
          return;
        }

        if (emailExists) {
          setLoading(false);
          alert('Email already exists. Please use another.');
          return;
        }
      }

      const userId = data.username; 
      await set(ref(database, 'users/' + userId), {
        ...data,
        createdAt: new Date().toISOString()
      });

      reset();
      setLoading(false);
      alert('Account created successfully!');
      router.push('/'); // Navigate to the login screen

    } catch (error) {
      setLoading(false);
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Account</Text>
        </View>
      <View style={styles.itemContainer}>
        {/* Personal Information Section */}
        <Text style={[styles.sectionHeader, { fontFamily: 'Poppins_500Medium' }]}>Personal Information</Text>
        
        <View style={styles.nameContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>First Name</Text>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                  placeholder="John"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.firstName && <Text style={styles.error}>{errors.firstName.message}</Text>}
          </View>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Last Name</Text>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                  placeholder="Doe"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}
          </View>
        </View>

        {/* Contact Information Section */}
        <Text style={[styles.sectionHeader, { fontFamily: 'Poppins_500Medium' }]}>Contact Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Phone Number</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                placeholder="(123) 456-7890"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}
        </View>

        {/* Address Information Section */}
        <Text style={[styles.sectionHeader, { fontFamily: 'Poppins_500Medium' }]}>Address Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Street Address</Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                placeholder="123 Main St"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.address && <Text style={styles.error}>{errors.address.message}</Text>}
        </View>

        <View style={styles.cityStateContainer}>
          <View style={[styles.inputContainer, { flex: 2, marginRight: 10 }]}>
            <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>City</Text>
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                  placeholder="New York"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.city && <Text style={styles.error}>{errors.city.message}</Text>}
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>State</Text>
            <Controller
              control={control}
              name="state"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                  placeholder="NY"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.state && <Text style={styles.error}>{errors.state.message}</Text>}
          </View>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>ZIP</Text>
            <Controller
              control={control}
              name="zipCode"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                  placeholder="10001"
                  keyboardType="number-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.zipCode && <Text style={styles.error}>{errors.zipCode.message}</Text>}
          </View>
        </View>

        {/* Account Information Section */}
        <Text style={[styles.sectionHeader, { fontFamily: 'Poppins_500Medium' }]}>Account Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Username</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                placeholder="username"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.passwordInput, { flex: 1, fontFamily: 'Poppins_400Regular' }]}
                  placeholder="••••••••"
                  secureTextEntry={secureTextEntry}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <Ionicons 
                    name={secureTextEntry ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#4B3130" 
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Confirm Password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.passwordInput, { flex: 1, fontFamily: 'Poppins_400Regular' }]}
                  placeholder="••••••••"
                  secureTextEntry={confirmSecureTextEntry}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
                >
                  <Ionicons 
                    name={confirmSecureTextEntry ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#4B3130" 
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={[styles.submitButtonText, { fontFamily: 'Poppins_600SemiBold' }]}>Create Account</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4B3130" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
   loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F1E5',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(247, 241, 229, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  container: {
    flexGrow: 1,
    // padding: 20,
    paddingTop: 60,
    backgroundColor: '#F7F1E5',
  },
  backButton: {
    position: 'absolute',
    // top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  header: {
    backgroundColor: '#4B3130',
    width: '100%',
    padding:10,
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
    headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
    color: '#4B3130',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ACBA96',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cityStateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#4B3130',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ACBA96',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    color: '#4B3130',
    fontSize: 16,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ACBA96',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  eyeIcon: {
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#4B3130',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#4B3130',
    fontSize: 14,
  },
  loginLink: {
    color: '#4B3130',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  passwordInput: {
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    color: '#4B3130',
    fontSize: 16,
  },
    error: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Poppins_400Regular',
  },
  itemContainer: {
    padding: 10,
  },
});

export default CustomerSignupForm;