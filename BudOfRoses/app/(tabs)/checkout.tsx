import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ref, update, push, remove, get } from 'firebase/database';
import { database } from './firebaseConfig';

type CartItem = {
  id: string;
  productId: string;
  productName: string; 
  price: number;
  quantity: number;
  totalAmount: number;
  image?: string;     
  selected: boolean;  // Make this required since we're using it
};

const SHIPPING_FEE = 80;

const Checkout = () => {
  const params = useLocalSearchParams();
  const { username, cartItems: cartItemsString, total } = params;
  
//  const handlePlaceOrder = async () => {
//   if (cartItems.length === 0) {
//     Alert.alert('No Items Selected', 'Please select items to checkout.');
//     return;
//   }

//   try {
//     // 1. Update product stocks and sales
//     const productUpdates: Record<string, number> = {};
    
//     // First get all current stock and sales values
//     const stockPromises = cartItems.map(item => 
//       get(ref(database, `productlist/${item.productId}/stocks`))
//     );
//     const salesPromises = cartItems.map(item => 
//       get(ref(database, `productlist/${item.productId}/sales`))
//     );

//     const stockSnapshots = await Promise.all(stockPromises);
//     const salesSnapshots = await Promise.all(salesPromises);

//     cartItems.forEach((item, index) => {
//       const currentStocks = stockSnapshots[index].val() || 0;
//       const currentSales = salesSnapshots[index].val() || 0;
      
//       productUpdates[`productlist/${item.productId}/stocks`] = currentStocks - item.quantity;
//       productUpdates[`productlist/${item.productId}/sales`] = currentSales + item.quantity;
//     });

//     // 2. Create order record
//     const orderData = {
//       username,
//       items: cartItems.map(item => ({
//         productId: item.productId,
//         productName: item.productName,
//         price: item.price,
//         quantity: item.quantity,
//         totalAmount: item.totalAmount,
//         image: item.image
//       })),
//       total: grandTotal,
//       date: new Date().toISOString(),
//       status: 'completed' as const
//     };

//     // 3. Save to user's order history and global orders
//     const userOrderRef = push(ref(database, `users/${username}/orders`));
//     const newOrderKey = userOrderRef.key;
    
//     if (!newOrderKey) {
//       throw new Error('Failed to generate order key');
//     }

//     const updates: Record<string, any> = {
//       ...productUpdates,
//       [`users/${username}/orders/${newOrderKey}`]: orderData,
//       [`orders/${newOrderKey}`]: orderData,
//       [`users/${username}/cart`]: null // Clear the cart
//     };

//     // Perform all updates in a single transaction
//     await update(ref(database), updates);

//     Alert.alert(
//       'Order Placed', 
//       `Your order has been placed successfully!\n\nTotal: ₱${grandTotal.toFixed(2)}`
//     );

//     router.push({
//       pathname: '/userProductList',
//       params: { username },
//     });

//   } catch (error) {
//     console.error('Checkout error:', error);
//     Alert.alert('Error', 'Failed to complete checkout. Please try again.');
//   }
// };

const handlePlaceOrder = async () => {
  const selectedItems = cartItems.filter(item => item.selected);
  
  if (selectedItems.length === 0) {
    Alert.alert('No Items Selected', 'Please select items to checkout.');
    return;
  }

  try {
    // 1. Update product stocks and sales for selected items only
    const productUpdates: Record<string, number> = {};
    
    // First get all current stock and sales values for selected items
    const stockPromises = selectedItems.map(item => 
      get(ref(database, `productlist/${item.productId}/stocks`))
    );
    const salesPromises = selectedItems.map(item => 
      get(ref(database, `productlist/${item.productId}/sales`))
    );

    const stockSnapshots = await Promise.all(stockPromises);
    const salesSnapshots = await Promise.all(salesPromises);

    selectedItems.forEach((item, index) => {
      const currentStocks = stockSnapshots[index].val() || 0;
      const currentSales = salesSnapshots[index].val() || 0;
      
      productUpdates[`productlist/${item.productId}/stocks`] = currentStocks - item.quantity;
      productUpdates[`productlist/${item.productId}/sales`] = currentSales + item.quantity;
    });

    // 2. Create order record with selected items only
    const orderData = {
      username,
      items: selectedItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        totalAmount: item.totalAmount,
        image: item.image
      })),
      total: selectedItems.reduce((sum, item) => sum + item.totalAmount, 0),
      date: new Date().toISOString(),
      status: 'completed' as const
    };

    // 3. Save to user's order history and global orders
    const userOrderRef = push(ref(database, `users/${username}/orders`));
    const newOrderKey = userOrderRef.key;
    
    if (!newOrderKey) {
      throw new Error('Failed to generate order key');
    }

    // 4. Remove only the checked-out items from cart
    const cartUpdates: Record<string, null> = {};
    selectedItems.forEach(item => {
      cartUpdates[`users/${username}/cart/${item.id}`] = null;
    });

    const updates = {
      ...productUpdates,
      [`users/${username}/orders/${newOrderKey}`]: orderData,
      [`orders/${newOrderKey}`]: orderData,
      ...cartUpdates
    };

    // Perform all updates in a single transaction
    await update(ref(database), updates);

    Alert.alert(
      'Order Placed', 
      `Your selected items have been ordered successfully!\n\nTotal: ₱${orderData.total.toFixed(2)}`
    );

    router.push({
      pathname: '/userProductList',
      params: { username },
    });

  } catch (error) {
    console.error('Checkout error:', error);
    Alert.alert('Error', 'Failed to complete checkout. Please try again.');
  }
};

  // Parse the cart items from the URL params
  const cartItems: CartItem[] = cartItemsString ? JSON.parse(cartItemsString as string) : [];
  const subtotal = total ? parseFloat(total as string) : 0;
  const grandTotal = subtotal + SHIPPING_FEE;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push({
                pathname: '/addToCart',
                params: { username },
            })}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cartItems.length === 0 ? (
            <Text style={styles.emptyText}>No items selected</Text>
          ) : (
            cartItems.map(item => (
              <View key={item.id} style={styles.orderItem}>
                <Image 
                  source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
                  style={styles.orderItemImage}
                  defaultSource={{ uri: 'https://via.placeholder.com/150' }}
                />
                <View style={styles.orderItemDetails}>
                  <Text style={styles.orderItemName} numberOfLines={1}>{item.productName}</Text>
                  <Text style={styles.orderItemPrice}>₱{item.price.toFixed(2)} × {item.quantity}</Text>
                </View>
                <Text style={styles.orderItemTotal}>₱{item.totalAmount.toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>₱{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping Fee</Text>
            <Text style={styles.priceValue}>₱{SHIPPING_FEE.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₱{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={cartItems.length === 0}
        >
          <Text style={styles.placeOrderText}>Place Order - ₱{grandTotal.toFixed(2)}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E5',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4B3130',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B3130',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderItemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B3130',
    marginBottom: 4,
  },
  orderItemPrice: {
    fontSize: 12,
    color: '#666',
  },
  orderItemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B3130',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#4B3130',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B3130',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B3130',
  },
  placeOrderButton: {
    backgroundColor: '#4B3130',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    paddingVertical: 12,
  },
});

export default Checkout;