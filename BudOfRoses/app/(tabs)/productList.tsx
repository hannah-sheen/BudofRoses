import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';

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
  const [products, setProducts] = useState<Product[]>([
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

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    router.push('/(tabs)/addProductForm');
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="pricetag" size={16} color="#4B3130" />
            <Text style={styles.statText}>${item.price.toFixed(2)}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="cart" size={16} color="#4B3130" />
            <Text style={styles.statText}>{item.sales}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="cube" size={16} color="#4B3130" />
            <Text style={styles.statText}>{item.stock}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={20} color="#4B3130" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Inventory</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#4B3130" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#A78A8A"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats Overview - Now in its own container with proper spacing */}
      <View style={styles.statsContainerWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContent}
        >
          <View style={styles.statCard}>
            <Ionicons name="grid" size={24} color="#4B3130" />
            <Text style={styles.statCardTitle}>Total Products</Text>
            <Text style={styles.statCardValue}>{products.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cart" size={24} color="#4B3130" />
            <Text style={styles.statCardTitle}>Total Sales</Text>
            <Text style={styles.statCardValue}>
              {products.reduce((sum, product) => sum + product.sales, 0)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="warning" size={24} color="#4B3130" />
            <Text style={styles.statCardTitle}>Low Stock</Text>
            <Text style={styles.statCardValue}>
              {products.filter(p => p.stock < 20).length}
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Products List - Now with proper top margin */}
      <View style={styles.productsListContainer}>
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#D9D3C3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: '#4B3130',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#ACBA96',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#4B3130',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
   statsContainerWrapper: {
    backgroundColor: '#D9D3C3',
    paddingVertical: 10,
    marginHorizontal: 15,
    marginBottom: 10, 
  },
  statsContent: {
    paddingHorizontal: 5, 
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ACBA96',
    borderRadius: 10,
    padding: 12,
    width: 140,
    height: 120,
    justifyContent: 'space-between',
  },
  statCardTitle: {
    color: '#4B3130',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    marginTop: 8,
  },
  statCardValue: {
    color: '#4B3130',
    fontSize: 28,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 4,
  },
  productsListContainer: {
    flex: 1, 
    marginTop: 0, 
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 30,
    paddingTop: 0, 
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#4B3130',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#ACBA96',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 5,
    color: '#4B3130',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    color: '#4B3130',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  moreButton: {
    padding: 5,
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    color: '#4B3130',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
});

export default ProductsListPage;