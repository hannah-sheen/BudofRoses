import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { database } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

interface OrderItem {
  itemName: string;
  quantity: number;
  itemPrice: number;
  productImage: string;
}

interface Order {
  id: string;
  dateOrdered: string;
  totalAmount: number;
  items: OrderItem[];
  // customerName removed since we won't display it here
}

const UserOrderHistoryScreen = () => {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  console.log('username: ', username);

  useEffect(() => {
    if (!username) return;

    const ordersRef = ref(database, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
        const ordersData = snapshot.val();
        const loadedOrders: Order[] = [];

        if (ordersData) {
        Object.keys(ordersData).forEach((key) => {
            const orderData = ordersData[key];
            if (orderData.customerUsername === username) {
            loadedOrders.push({
                id: key,
                dateOrdered: orderData.dateOrdered,
                totalAmount: orderData.totalAmount,
                items: [{
                itemName: orderData.itemName,
                quantity: orderData.quantity,
                itemPrice: orderData.itemPrice,
                productImage: orderData.productImage,
                }],
            });
            }
        });
        }

        loadedOrders.sort((a, b) =>
        new Date(b.dateOrdered).getTime() - new Date(a.dateOrdered).getTime()
        );

        setOrders(loadedOrders);
        setLoading(false);
    });

    return () => unsubscribe();
    }, [username]);``


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toFixed(2)}`;
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>{formatDate(item.dateOrdered)}</Text>
      </View>

      {/* Customer name removed */}

      <View style={styles.orderItems}>
        {item.items.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <Ionicons name="cube-outline" size={40} color="#4B3130" style={styles.productIcon} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.itemName}</Text>
              <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
            </View>
            <Text style={styles.productPrice}>{formatCurrency(product.itemPrice)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalText}>
          Total (incl. ₱80 shipping): {formatCurrency(item.totalAmount)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B3130" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push({
            pathname: '/userProductList',
            params: {username: username}
        })} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Order History</Text>
        </View>
      </View>

      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item: Order) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={100} color="#4B3130" style={styles.emptyIcon} />
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubText}>Your order history will appear here</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0DCD3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0DCD3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#4B3130',
    position: 'relative',
    justifyContent: 'space-between',
  },
  backButton: {
    zIndex: 1,
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: '#D9D3C3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#4B3130',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ACBA96',
  },
  orderDate: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#4B3130',
  },
  orderItems: {
    marginBottom: 10,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#4B3130',
    marginBottom: 3,
  },
  productQuantity: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#4B3130',
    opacity: 0.7,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#4B3130',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ACBA96',
  },
  totalText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#4B3130',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#4B3130',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#4B3130',
    textAlign: 'center',
    opacity: 0.7,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  productIcon: {
    marginRight: 10,
  },
});

export default UserOrderHistoryScreen;
