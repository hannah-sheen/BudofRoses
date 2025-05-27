import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, get, child } from 'firebase/database';
import Navbar from './navBar';
import { database } from './firebaseConfig';

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (!storedUsername) {
          console.error('No stored username found.');
          return;
        }

        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'users'));

        if (snapshot.exists()) {
          const users = snapshot.val();
          const matchedUser = Object.values(users).find(
            (user: any) => user.username === storedUsername
          );

          if (matchedUser) {
            setUserData(matchedUser);
          } else {
            console.error('User not found in database.');
          }
        } else {
          console.error('No users data found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('username');
    router.replace('/');
  };

  if (loading) {
    return (
      <View
        style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}
      >
        <ActivityIndicator size="large" color="#4B3130" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with addToCart style */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/userProductList')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>
          {userData.firstName} {userData.lastName}
        </Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{userData.address}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{userData.phone}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData.email}</Text>

        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{userData.username}</Text>

        <Text style={styles.label}>Password:</Text>
        <View style={styles.passwordContainer}>
          <Text style={[styles.value, { flex: 1 }]}>
            {showPassword ? userData.password : '******'}
          </Text>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={24}
              color="#4B3130"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D3C3',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#4B3130',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    width: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    color: '#4B3130',
    fontSize: 16,
  },
  value: {
    fontFamily: 'Poppins_400Regular',
    color: '#ACBA96',
    fontSize: 16,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#4B3130',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  logoutText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
});

export default Profile;
