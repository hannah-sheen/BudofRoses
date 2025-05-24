import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const CustomerSignupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
  });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

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

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // Validate form data
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Submit logic here
    console.log('Form submitted:', formData);
    // router.push('/login'); // Uncomment to navigate after submission
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#4B3130" />
      </TouchableOpacity>

      <Text style={[styles.header, { fontFamily: 'Poppins_600SemiBold' }]}>Create Account</Text>

      {/* Personal Information Section */}
      <Text style={[styles.sectionHeader, { fontFamily: 'Poppins_500Medium' }]}>Personal Information</Text>
      
      <View style={styles.nameContainer}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
          <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>First Name</Text>
          <TextInput
            style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
            placeholder="John"
            value={formData.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1 }]}>
          <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Last Name</Text>
          <TextInput
            style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
            placeholder="Doe"
            value={formData.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
          />
        </View>
      </View>

      {/* Contact Information Section */}
      <Text style={[styles.sectionHeader, { fontFamily: 'Poppins_500Medium' }]}>Contact Information</Text>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Email</Text>
        <TextInput
          style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Phone Number</Text>
        <TextInput
          style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
          placeholder="(123) 456-7890"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => handleChange('phone', text)}
        />
      </View>

      {/* Address Information Section */}
      <Text style={[styles.sectionHeader, { fontFamily: 'Poppins_500Medium' }]}>Address Information</Text>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Street Address</Text>
        <TextInput
          style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
          placeholder="123 Main St"
          value={formData.address}
          onChangeText={(text) => handleChange('address', text)}
        />
      </View>

      <View style={styles.cityStateContainer}>
        <View style={[styles.inputContainer, { flex: 2, marginRight: 10 }]}>
          <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>City</Text>
          <TextInput
            style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
            placeholder="New York"
            value={formData.city}
            onChangeText={(text) => handleChange('city', text)}
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
          <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>State</Text>
          <TextInput
            style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
            placeholder="NY"
            value={formData.state}
            onChangeText={(text) => handleChange('state', text)}
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1 }]}>
          <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>ZIP</Text>
          <TextInput
            style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
            placeholder="10001"
            keyboardType="number-pad"
            value={formData.zipCode}
            onChangeText={(text) => handleChange('zipCode', text)}
          />
        </View>
      </View>

      {/* Account Information Section */}
      <Text style={[styles.sectionHeader, { fontFamily: 'Poppins_500Medium' }]}>Account Information</Text>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Username</Text>
        <TextInput
          style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
          placeholder="username"
          autoCapitalize="none"
          value={formData.username}
          onChangeText={(text) => handleChange('username', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={[styles.passwordInput, { flex: 1, fontFamily: 'Poppins_400Regular' }]}
            placeholder="••••••••"
            secureTextEntry={secureTextEntry}
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
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
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Confirm Password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={[styles.passwordInput, { flex: 1, fontFamily: 'Poppins_400Regular' }]}
            placeholder="••••••••"
            secureTextEntry={confirmSecureTextEntry}
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
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
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={[styles.submitButtonText, { fontFamily: 'Poppins_600SemiBold' }]}>Create Account</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, { fontFamily: 'Poppins_400Regular' }]}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.loginLink, { fontFamily: 'Poppins_600SemiBold' }]}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F1E5',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F7F1E5',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  header: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: '#4B3130',
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
  }
});

export default CustomerSignupForm;