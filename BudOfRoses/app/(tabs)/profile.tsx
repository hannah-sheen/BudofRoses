import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Profile = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear any auth state or context if used
    router.replace('/'); // Navigate to login screen
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/userProductList')}>
          <Ionicons name="arrow-back" size={24} color="#4B3130" />
        </TouchableOpacity>
        <Text style={styles.title}>User Profile</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>Jane Doe</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>jane@example.com</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D3C3',
    padding: 20,
    marginTop: -400,
    justifyContent: 'center',
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
