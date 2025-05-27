import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { getDatabase, ref, get, update } from 'firebase/database';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Navbar from './navBar';

const OrderStatus = () => {
  const db = getDatabase();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch orders for logged in user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const storedUsername = await AsyncStorage.getItem('username');
        if (!storedUsername) {
          console.warn('No stored username found.');
          setOrders([]);
          return;
        }

        const ordersRef = ref(db, `orders/${storedUsername}`);
        const ordersSnap = await get(ordersRef);

        if (ordersSnap.exists()) {
          const ordersData = ordersSnap.val();
          const entries = Object.entries(ordersData).filter(([key]) => key !== 'status');
          setOrders(entries);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [loading]); // Reload on loading change to refresh after update

  // Format timestamp string to readable date/time
  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  };

  // Open modal with order details
  const openOrderDetails = (orderId: string, order: any) => {
    setSelectedOrder({ id: orderId, ...order });
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  // Update order status in Firebase
  const updateOrderStatus = async (status: string) => {
    if (!selectedOrder) return;

    try {
      setLoading(true);
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const storedUsername = await AsyncStorage.getItem('username');
      if (!storedUsername) {
        Alert.alert('Error', 'User not found');
        setLoading(false);
        return;
      }

      const orderRef = ref(db, `orders/${storedUsername}/${selectedOrder.id}`);
      await update(orderRef, { status });
      Alert.alert('Success', `Order marked as ${status}`);
      closeModal();
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    filterStatus === 'All'
      ? orders
      : orders.filter(([, order]: any) => order.status === filterStatus);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/userProductList')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Status</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Order History</Text>

        <Picker
          selectedValue={filterStatus}
          onValueChange={(value) => setFilterStatus(value)}
          style={styles.picker}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="In Transit" value="In Transit" />
          <Picker.Item label="Shipped" value="Shipped" />
          <Picker.Item label="Received" value="Received" />
          <Picker.Item label="Cancelled" value="Cancelled" />
        </Picker>

        {filteredOrders.length === 0 ? (
          <Text style={styles.noOrdersText}>No orders found.</Text>
        ) : (
          filteredOrders
            .slice() // clone array to avoid mutating original
            .reverse()
            .map(([orderId, order]: any) => {
              const total = order.items?.reduce(
                (sum: number, item: any) => sum + item.quantity * item.price,
                0
              );
              const isCancelled = order.status === 'Cancelled';

              return (
                <TouchableOpacity
                  key={orderId}
                  style={[
                    styles.orderBox,
                    isCancelled && { borderColor: '#d9534f', borderWidth: 1 },
                  ]}
                  onPress={() => openOrderDetails(orderId, order)}
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
                </TouchableOpacity>
              );
            })
        )}
      </ScrollView>

      {/* Order Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedOrder && (
              <>
                <Text style={styles.modalTitle}>Order Details</Text>
                <Text style={styles.modalLabel}>Order Date:</Text>
                <Text style={styles.modalValue}>
                  {formatDate(selectedOrder.date || selectedOrder.id)}
                </Text>

                <Text style={styles.modalLabel}>Status:</Text>
                <Text style={styles.modalValue}>{selectedOrder.status}</Text>

                <Text style={styles.modalLabel}>Items:</Text>
                {selectedOrder.items?.map((item: any, idx: number) => (
                  <Text key={idx} style={styles.modalValue}>
                    • {item.name} x{item.quantity} - ₱{item.price}
                  </Text>
                ))}

                <Text style={styles.modalLabel}>Total:</Text>
                <Text style={styles.modalValue}>
                  ₱
                  {selectedOrder.items?.reduce(
                    (sum: number, item: any) => sum + item.quantity * item.price,
                    0
                  )}
                </Text>

                {(selectedOrder.status === 'In Transit' ||
                  selectedOrder.status === 'Shipped') && (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.receiveButton]}
                      onPress={() => updateOrderStatus('Received')}
                      disabled={loading}
                    >
                      <Text style={styles.buttonText}>Order Received</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={() => {
                        Alert.alert(
                          'Confirm Cancel',
                          'Are you sure you want to cancel this order?',
                          [
                            { text: 'No' },
                            {
                              text: 'Yes',
                              onPress: () => updateOrderStatus('Cancelled'),
                            },
                          ]
                        );
                      }}
                      disabled={loading}
                    >
                      <Text style={styles.buttonText}>Cancel Order</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                  disabled={loading}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E5',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#4B3130',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#4B3130',
  },
  modalValue: {
    fontSize: 16,
    marginTop: 5,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  receiveButton: {
    backgroundColor: '#4B9F50',
  },
  cancelButton: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#4B3130',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default OrderStatus;
