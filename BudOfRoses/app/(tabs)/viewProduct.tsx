import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './addToCart';
import { database } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

type Product = {
  id: string;
  productName: string;
  image: string;
  price: number;
  category: string;
  description?: string;
  stocks: number;
};

const ViewProduct = () => {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const productRef = ref(database, `productlist/${productId}`);
    const unsubscribe = onValue(productRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProduct({
          id: productId as string,
          ...data
        });
      } else {
        setProduct(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  const addToCart = () => {
    // if (!product) return;

    // dispatch({
    //   type: 'ADD_TO_CART',
    //   product: {
    //     id: product.id,
    //     name: product.productName,
    //     image: product.image,
    //     price: product.price,
    //     category: product.category,
    //     stock: product.stocks
    //   },
    //   quantity,
    // });

    // Alert.alert(
    //   'Success',
    //   'Item Added to cart!',
    //   [
    //     {
    //       text: 'OK',
    //       onPress: () => router.replace('/(tabs)/addToCart'),
    //     },
    //   ],
    //   { cancelable: false }
    // );
    alert('Add to cart');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B3130" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/userProductList')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>View Product</Text>
          <View style={{ width: 24 }} />
        </View>

        <Image
          source={{ uri: product.image || 'https://via.placeholder.com/150' }}
          style={styles.image}
          defaultSource={{ uri: 'https://via.placeholder.com/150' }}
        />

        <Text style={styles.name}>{product.productName}</Text>
        <Text style={styles.price}>₱{product.price.toFixed(2)}</Text>

        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}

        <Text style={styles.detail}>Category: {product.category}</Text>
        <Text style={styles.detail}>Stocks Available: {product.stocks}</Text>

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

        <TouchableOpacity
          style={styles.addButton}
          onPress={addToCart}
          disabled={product.stocks <= 0}
        >
          <Text style={styles.addButtonText}>
            {product.stocks > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  image: {
    width: '90%',
    height: 300,
    borderRadius: 10,
    marginVertical: 20,
    alignSelf: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B3130',
    textAlign: 'center',
    marginBottom: 5,
  },
  price: {
    fontSize: 22,
    color: '#DBA6B6',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  detail: {
    fontSize: 16,
    color: '#4B3130',
    marginVertical: 5,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 15,
    color: '#4B3130',
    marginVertical: 10,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
  quantity: {
    marginHorizontal: 15,
    fontSize: 18,
    color: '#4B3130',
  },
  addButton: {
    backgroundColor: '#4B3130',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ViewProduct;
