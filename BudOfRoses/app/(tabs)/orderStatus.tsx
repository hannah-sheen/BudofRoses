import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const OrderStatus = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    Alert.alert('Order Received', 'Thank you for confirming your order.');
    setIsConfirmed(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Status</Text>
      <View style={styles.statusBox}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{isConfirmed ? 'Received' : 'In Transit'}</Text>
      </View>
      {!isConfirmed && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm Order Received</Text>
        </TouchableOpacity>
      )}
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
  statusBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    marginBottom: 30,
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
  },
  confirmText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
});

export default OrderStatus;
