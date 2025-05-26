import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { database } from './firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';

type Product = {
  id: string;
  productName: string;
  image: string;
  price: number;
  category: string;
  description?: string;
  sizes?: string[];
  stocks: number;
  sales: number;
};

const ProductDetails = () => {
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

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

  const handleEdit = () => {
    if (!product?.id) return;
    router.push({
        pathname: '/editProduct',
        params: { productId: product.id },
    });
  };


  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              if (!productId) {
                Alert.alert('Error', 'No product ID found');
                return;
              }

              // Create reference to the product in Firebase
              const productRef = ref(database, `productlist/${productId}`);
              
              // Delete the product
              await remove(productRef);
              
              Alert.alert('Success', 'Product has been deleted successfully');
              router.replace('/productList'); 
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Failed to delete product');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B3130" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/productList')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

   return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/productList')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {imageError || !product.image ? (
          <View style={[styles.image, styles.fallbackImage]}>
            <Ionicons name="image" size={60} color="#4B3130" />
            <Text style={styles.fallbackText}>No Image Available</Text>
          </View>
        ) : (
          <Image 
            source={{ uri: product.image }} 
            style={styles.image}
            resizeMode="contain"
            onError={() => setImageError(true)}
          />
        )}

        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{product.productName}</Text>
          <Text style={styles.price}>₱{product.price?.toFixed(2)}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Information</Text>
            <View style={styles.detailRow}>
              <Ionicons name="pricetag" size={18} color="#4B3130" />
              <Text style={styles.detail}>Category: {product.category}</Text>
            </View>

            {product.sizes && product.sizes.length > 0 && (
              <View style={styles.detailRow}>
                <Ionicons name="options" size={18} color="#4B3130" />
                <Text style={styles.detail}>Sizes: {product.sizes.join(', ')}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Ionicons name="cube" size={18} color="#4B3130" />
              <Text style={styles.detail}>Stocks: {product.stocks}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="cart" size={18} color="#4B3130" />
              <Text style={styles.detail}>Sales: {product.sales}</Text>
            </View>
          </View>

          {/* Description Section (moved to bottom) */}
          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{product.description}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons (keep the same) */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={18} color="#4B3130" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E5',
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
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 30,
    alignItems: 'center',
  },
 image: {
    width: '90%',
    height: 300,
    borderRadius: 12,
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  fallbackImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  fallbackText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#4B3130',
  },
  detailsContainer: {
    width: '90%',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#4B3130',
    textAlign: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontFamily: 'Poppins_600SemiBold',
    color: '#DBA6B6',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  detail: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#4B3130',
    marginLeft: 10,
    flexShrink: 1,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: '#4B3130',
    textAlign: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#DBA6B6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#4B3130',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#4B3130',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
    fontSize: 16,
  },
   section: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#4B3130',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  descriptionContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#4B3130',
    lineHeight: 22,
  },
});

export default ProductDetails;