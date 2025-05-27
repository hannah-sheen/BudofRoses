// app/(tabs)/orderStatus.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getDatabase, ref, set, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const OrderStatus = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const db = getDatabase();
  const auth = getAuth();

  useEffect(() => {
    const fetchOrderStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const statusRef = ref(db, `orders/${user.uid}/status`);
        const snapshot = await get(statusRef);
        if (snapshot.exists()) {
          setIsConfirmed(snapshot.val() === 'Received');
        }
      }
    };

    fetchOrderStatus();
  }, []);

  const handleConfirm = async () => {
    const user = auth.currentUser;
    if (user) {
      await set(ref(db, `orders/${user.uid}/status`), 'Received');
      setIsConfirmed(true);
      Alert.alert('Order Received', 'Thank you for confirming your order.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/userProductList')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Status</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{isConfirmed ? 'Received' : 'In Transit'}</Text>
        </View>

        {!isConfirmed && (
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirm Order Received</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E5',
  },
  scrollContainer: {
    paddingBottom: 40,
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
  statusBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    margin: 20,
    marginTop: 30,
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
    marginTop: 5,
  },
  confirmButton: {
    backgroundColor: '#4B3130',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
  },
  confirmText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default OrderStatus;