import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ref, get } from 'firebase/database';
import { database } from './firebaseConfig';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const Profile = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const username = params.username as string;
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!username) {
          Alert.alert('Error', 'No username provided');
          router.replace('/');
          return;
        }

        const userRef = ref(database, `users/${username}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          Alert.alert('Error', 'User not found');
          router.replace('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, router]);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Any cleanup logic here if needed
            router.replace('/');
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4B3130" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>No user data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push({
            pathname: "/userProductList",
            params: { username: username }
          })}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>User Profile</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User Information */}
        <View style={styles.infoBox}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>
            {userData.firstName} {userData.lastName}
          </Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userData.email}</Text>

          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{userData.phone || 'Not provided'}</Text>

          <Text style={styles.sectionTitle}>Address Information</Text>

          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{userData.address || 'Not provided'}</Text>

          <Text style={styles.label}>City:</Text>
          <Text style={styles.value}>{userData.city || 'Not provided'}</Text>

          <Text style={styles.label}>State:</Text>
          <Text style={styles.value}>{userData.state || 'Not provided'}</Text>

          <Text style={styles.label}>Zip Code:</Text>
          <Text style={styles.value}>{userData.zipCode || 'Not provided'}</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D3C3',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#4B3130',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    width: '100%',
    position: 'relative',
  },
  backButton: {
    paddingHorizontal: 20,
    zIndex: 1,
  },
  editButton: {
    paddingHorizontal: 20,
    zIndex: 1,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#4B3130',
    fontSize: 18,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 5,
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    color: '#4B3130',
    fontSize: 16,
    marginTop: 8,
  },
  value: {
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    fontSize: 16,
    marginBottom: 15,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#4B3130',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 3,
    marginBottom: 20,
  },
  logoutText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Profile;