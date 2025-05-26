import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const Profile = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Handle actual logout logic here
    router.replace('/(tabs)'); // Navigate to the login screen or main tabs root
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#4B3130',
    marginBottom: 30,
    textAlign: 'center',
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
