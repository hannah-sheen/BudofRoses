import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import Navbar from './navBar';
import { auth, database } from './firebaseConfig'; // Adjust path as needed

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Step 1: Get username using UID
          const uidRef = ref(database, `users/${user.uid}`);
          const uidSnap = await get(uidRef);

          if (uidSnap.exists()) {
            const username = uidSnap.val().username;

            // Step 2: Get full user details by username
            const userRef = ref(database, `users/${username}`);
            const userSnap = await get(userRef);

            if (userSnap.exists()) {
              setUserData(userSnap.val());
            } else {
              console.error("No user data found for this username.");
            }
          } else {
            console.error("No username found for this UID.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4B3130" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/userProductList')}>
          <Ionicons name="arrow-back" size={24} color="#4B3130" />
        </TouchableOpacity>
        <Text style={styles.title}>User Profile</Text>
        <View style={{ width: 24 }} /> {/* spacer */}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userData.firstName} {userData.lastName}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{userData.address}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{userData.phone}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData.email}</Text>

        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{userData.username}</Text>

        <Text style={styles.label}>Password:</Text>
        <Text style={styles.value}>{userData.password}</Text>
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
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#4B3130',
    textAlign: 'center',
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
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
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#4B3130',
    padding: 15,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
});

export default Profile;
