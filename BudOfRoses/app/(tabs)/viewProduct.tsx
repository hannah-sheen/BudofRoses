import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './addToCart';

const ViewProduct = () => {
  const { product } = useLocalSearchParams();
  const parsed = product ? JSON.parse(product as string) : null;
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  // Reset quantity to 1 when a new product is viewed
  useEffect(() => {
    setQuantity(1);
  }, [parsed?.id]);

  const addToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      product: parsed,
      quantity,
    });

    Alert.alert(
      'Success',
      'Item Added to cart!',
      [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/addToCart'),
        },
      ],
      { cancelable: false }
    );
  };

  if (!parsed) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/userProductList')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <Image source={{ uri: parsed.image }} style={styles.image} />

      <Text style={styles.name}>{parsed.name}</Text>
      <Text style={styles.price}>
        {parsed.price !== undefined && parsed.price !== null
          ? `$${parsed.price.toFixed(2)}`
          : 'Price not available'}
      </Text>
      <Text style={styles.detail}>Category: {parsed.category}</Text>
      <Text style={styles.detail}>In Stock: {parsed.stock}</Text>
      <Text style={styles.detail}>Sales: {parsed.sales}</Text>

      {/* Rating */}
      <View style={styles.ratingRow}>
        <Text style={styles.detail}>Rating: {parsed.rating}</Text>
        <Ionicons name="star" size={16} color="#FFD700" style={{ marginLeft: 4 }} />
      </View>

      {/* Quantity Adjuster */}
      <View style={styles.quantityRow}>
        <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
          <Ionicons name="remove-circle" size={30} color="#4B3130" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
          <Ionicons name="add-circle" size={30} color="#4B3130" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addToCart}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, alignItems: 'center' },
  header: {
    flexDirection: 'row',
    backgroundColor: '#4B3130',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    width: '115%',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  image: { width: 200, height: 200, borderRadius: 10, marginVertical: 15 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#4B3130', textAlign: 'center' },
  price: { fontSize: 20, color: '#ACBA96', marginBottom: 10 },
  detail: { fontSize: 16, color: '#4B3130', marginVertical: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  quantity: { marginHorizontal: 15, fontSize: 18 },
  addButton: {
    backgroundColor: '#ACBA96',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default ViewProduct;
