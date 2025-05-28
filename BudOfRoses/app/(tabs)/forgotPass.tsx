import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getDatabase, ref, get, update } from 'firebase/database';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const ForgotPassSchema = Yup.object().shape({
  identifier: Yup.string().required('Username or email is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

const ForgotPassScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const handleResetPassword = async (values: any) => {
    const db = getDatabase();
    const usersRef = ref(db, 'users/');
    setLoading(true);

    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const users = snapshot.val();
        const userKey = Object.keys(users).find((key) => {
          const user = users[key];
          return (
            user.username.toLowerCase() === values.identifier.toLowerCase() ||
            user.email.toLowerCase() === values.identifier.toLowerCase()
          );
        });

        if (!userKey) {
          Alert.alert('Error', 'User not found');
        } else {
          await update(ref(db, `users/${userKey}`), {
            password: values.newPassword,
          });
          Alert.alert('Success', 'Password updated successfully');
          router.push('/');
        }
      } else {
        Alert.alert('Error', 'No users found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B3130" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Formik
          initialValues={{ identifier: '', newPassword: '', confirmPassword: '' }}
          validationSchema={ForgotPassSchema}
          onSubmit={handleResetPassword}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <Text style={styles.label}>Username or Email</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('identifier')}
                onBlur={handleBlur('identifier')}
                value={values.identifier}
                placeholder="Enter username or email"
                placeholderTextColor="#888"
              />
              {errors.identifier && touched.identifier && (
                <Text style={styles.errorText}>{errors.identifier}</Text>
              )}

              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  value={values.newPassword}
                  secureTextEntry={!showNewPassword}
                  placeholder="New password"
                  placeholderTextColor="#888"
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Ionicons
                    name={showNewPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword && touched.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}

              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor="#888"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={styles.button}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F1E5',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#4B3130',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#4B3130',
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#4B3130',
  },
  errorText: {
    color: 'red',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 10,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#4B3130',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ccc',
  paddingHorizontal: 12,
  borderRadius: 8,
  marginBottom: 12,
},
passwordInput: {
  flex: 1,
  paddingVertical: 12,
  fontFamily: 'Poppins_400Regular',
  color: '#4B3130',
},
});

export default ForgotPassScreen;
