import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';
import Navbar from './navBar';

const OrderStatus = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Step 1: Get username from users/{uid}/username
          const usernameRef = ref(db, `users/${user.uid}/username`);
          const usernameSnap = await get(usernameRef);

          if (!usernameSnap.exists()) {
            console.warn('Username not found');
            setOrders([]);
            return;
          }

          const username = usernameSnap.val();

          // Step 2: Use username to fetch orders from orders/{username}
          const ordersRef = ref(db, `orders/${username}`);
          const ordersSnap = await get(ordersRef);

          if (ordersSnap.exists()) {
            const ordersData = ordersSnap.val();
            const entries = Object.entries(ordersData).filter(
              ([key]) => key !== 'status'
            );
            setOrders(entries);
          } else {
            setOrders([]);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          setOrders([]);
        }
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  };

  const filteredOrders =
    filterStatus === 'All'
      ? orders
      : orders.filter(
          ([, order]: any) => order.status === filterStatus
        );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Order History</Text>

        <Picker
          selectedValue={filterStatus}
          onValueChange={(value) => setFilterStatus(value)}
          style={styles.picker}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="In Transit" value="In Transit" />
          <Picker.Item label="Received" value="Received" />
          <Picker.Item label="Cancelled" value="Cancelled" />
        </Picker>

        {filteredOrders.length === 0 ? (
          <Text style={styles.noOrdersText}>No orders found.</Text>
        ) : (
          filteredOrders
            .reverse()
            .map(([orderId, order]: any) => {
              const total = order.items?.reduce(
                (sum: number, item: any) =>
                  sum + item.quantity * item.price,
                0
              );
              const isCancelled = order.status === 'Cancelled';

              return (
                <View
                  key={orderId}
                  style={[
                    styles.orderBox,
                    isCancelled && {
                      borderColor: '#d9534f',
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.orderDate,
                      isCancelled && { color: '#d9534f' },
                    ]}
                  >
                    {formatDate(order.date || orderId)}
                  </Text>
                  <Text
                    style={[
                      styles.statusText,
                      isCancelled && { color: '#d9534f' },
                    ]}
                  >
                    Status: {order.status}
                  </Text>

                  {order.items?.map((item: any, index: number) => (
                    <Text
                      key={index}
                      style={[
                        styles.itemText,
                        isCancelled && { color: '#888' },
                      ]}
                    >
                      • {item.name} x{item.quantity} - ₱{item.price}
                    </Text>
                  ))}

                  <Text
                    style={[
                      styles.totalText,
                      isCancelled && { color: '#d9534f' },
                    ]}
                  >
                    Total: ₱{total}
                  </Text>
                </View>
              );
            })
        )}
      </ScrollView>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4B3130',
    marginBottom: 10,
  },
  picker: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  noOrdersText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  orderBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B3130',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
  totalText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#4B3130',
  },
});

export default OrderStatus;
