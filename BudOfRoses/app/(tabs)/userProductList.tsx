// ProductsListPage.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useCart } from './addToCart';

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  sales: number;
  stock: number;
  rating: number;
};

const ProductsListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { cart } = useCart();

  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Red Roses Bouquet',
      image: 'https://via.placeholder.com/150',
      price: 29.99,
      category: 'Roses',
      sales: 124,
      stock: 45,
      rating: 4.8
    },
    {
      id: '2',
      name: 'Sunflower Arrangement',
      image: 'https://via.placeholder.com/150',
      price: 24.99,
      category: 'Sunflowers',
      sales: 89,
      stock: 32,
      rating: 4.6
    },
    {
      id: '3',
      name: 'Mixed Spring Flowers',
      image: 'https://via.placeholder.com/150',
      price: 34.99,
      category: 'Mixed Bouquets',
      sales: 156,
      stock: 28,
      rating: 4.9
    },
    {
      id: '4',
      name: 'White Orchids',
      image: 'https://via.placeholder.com/150',
      price: 39.99,
      category: 'Orchids',
      sales: 72,
      stock: 15,
      rating: 4.7
    },
    {
      id: '5',
      name: 'Tulips Collection',
      image: 'https://via.placeholder.com/150',
      price: 27.99,
      category: 'Tulips',
      sales: 103,
      stock: 37,
      rating: 4.5
    },
  ]);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePressProduct = (product: Product) => {
    router.push({
      pathname: '/viewProduct',
      params: { product: JSON.stringify(product) },
    });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.gridItem} onPress={() => handlePressProduct(item)}>
      <Image source={{ uri: item.image }} style={styles.gridImage} />
      <Text style={styles.gridText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flowers</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/addToCart')}>
          <Ionicons name="cart" size={24} color="#fff" />
        </TouchableOpacity>
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

      {/* Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D9D3C3' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 15, paddingTop: 50, backgroundColor: '#4B3130',
  },
  headerTitle: {
    fontSize: 22, fontFamily: 'Poppins_600SemiBold', color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', margin: 15, borderRadius: 10,
    paddingHorizontal: 15, elevation: 2,
  },
  searchInput: {
    flex: 1, height: 50, color: '#4B3130', fontSize: 16,
    fontFamily: 'Poppins_400Regular', marginLeft: 10,
  },
  gridList: {
    paddingHorizontal: 10, paddingBottom: 30,
  },
  gridItem: {
    flex: 1, backgroundColor: '#fff', margin: 8, borderRadius: 10,
    alignItems: 'center', padding: 10,
  },
  gridImage: {
    width: 100, height: 100, borderRadius: 10,
  },
  gridText: {
    marginTop: 8, fontSize: 14, fontFamily: 'Poppins_400Regular', color: '#4B3130',
    textAlign: 'center',
  },
});

export default ProductsListPage;
