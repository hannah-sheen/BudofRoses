import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type CartItem = {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  totalAmount: number;
  image?: string;
};

const SHIPPING_FEE = 80;

const Checkout = () => {
  const params = useLocalSearchParams();
  const { username, cartItems: cartItemsString, total } = params;
  
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select items to checkout.');
      return;
    }

    // Here you would typically send the order to your backend
    Alert.alert(
      'Order Placed', 
      `Your order has been placed successfully!\n\nTotal: ₱${grandTotal.toFixed(2)}`
    );

    router.push({
      pathname: '/userProductList',
      params: { username },
    });
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