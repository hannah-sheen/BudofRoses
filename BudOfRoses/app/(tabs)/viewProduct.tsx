import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
  const { productId, username } = useLocalSearchParams<{
    productId: string;
    username: string;
  }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
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
          ...data,
        });
      } else {
        setProduct(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  const handleBuyNow = () => {
    if (!product || !username) {
      Alert.alert('Error', 'Missing product or user info');
      return;
    }

    if (quantity > product.stocks) {
      Alert.alert('Error', 'Not enough stock available');
      return;
    }

    const orderDetails = {
      productId: product.id,
      productName: product.productName,
      image: product.image,
      price: product.price,
      quantity: quantity,
      totalAmount: product.price * quantity,
      category: product.category,
      stocks: product.stocks,
    };

    router.push({
      pathname: '/checkout',
      params: {
        username: username,
        orderDetails: JSON.stringify(orderDetails),
      },
    });
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() =>  
              router.push({
              pathname: '/userProductList',
              params: { username: username },
            })}>
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
          style={styles.buyButton}
          onPress={handleBuyNow}
          disabled={product.stocks <= 0}
        >
          <Text style={styles.buyButtonText}>
            {product.stocks > 0 ? 'Buy Now' : 'Out of Stock'}
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
    padding: 15,
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
  buyButton: {
    backgroundColor: '#4B3130',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ViewProduct;
