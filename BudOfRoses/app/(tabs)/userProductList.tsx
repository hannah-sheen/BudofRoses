import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, TextInput, SafeAreaView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useCart } from './addToCart';
import Navbar from './navBar';
import { database } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

type Product = {
  id: string;
  productName: string;
  image: string;
  price: number;
  category: string;
  sales: number;
  stocks: number;
};

const UserProductsListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { cart } = useCart();
  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    const productsRef = ref(database, 'productlist');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setProducts(productsArray);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B3130" />
      </View>
    );
  }

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePressProduct = (product: Product) => {
    router.push({
      pathname: '/viewProduct',
      params: { productId: product.id }, // Only pass the ID
    });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.gridItem} onPress={() => handlePressProduct(item)}>
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
        style={styles.gridImage} 
        defaultSource={{ uri: 'https://via.placeholder.com/150' }}
      />
      <Text style={styles.gridText}>{item.productName}</Text>
      <Text style={styles.priceText}>₱{item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bud of Roses</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#4B3130" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search flowers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      )}
      
      <Navbar/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D9D3C3' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9D3C3',
  },
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    padding: 15, 
    paddingTop: 50, 
    backgroundColor: '#4B3130',
  },
  headerTitle: {
    fontSize: 22, 
    fontFamily: 'Poppins_600SemiBold', 
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
    margin: 15, 
    borderRadius: 10,
    paddingHorizontal: 15, 
    elevation: 2,
  },
  searchInput: {
    flex: 1, 
    height: 50, 
    color: '#4B3130', 
    fontSize: 16,
    fontFamily: 'Poppins_400Regular', 
    marginLeft: 10,
  },
  gridList: {
    paddingHorizontal: 10, 
    paddingBottom: 80,
  },
  gridItem: {
    flex: 1, 
    backgroundColor: '#fff', 
    margin: 8, 
    borderRadius: 10,
    alignItems: 'center', 
    padding: 10,
    elevation: 2,
  },
  gridImage: {
    width: 100, 
    height: 100, 
    borderRadius: 10,
    resizeMode: 'cover',
  },
  gridText: {
    marginTop: 8, 
    fontSize: 14, 
    fontFamily: 'Poppins_400Regular', 
    color: '#4B3130',
    textAlign: 'center',
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#DBA6B6',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: '#4B3130',
  },
});

export default UserProductsListPage;