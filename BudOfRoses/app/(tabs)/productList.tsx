import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';
import { database } from './firebaseConfig';
import { onValue, ref } from 'firebase/database';

type Product = {
  id: string;
  productName: string;
  image: string;
  price: number;
  category: string;
  sales: number;
  stocks: number;
};

const LOW_STOCK_THRESHOLD = 20;

const ProductsListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    const productsRef = ref(database, 'productlist');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedProducts = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setProducts(loadedProducts);
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
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    router.push('/addProductForm');
  };

  const renderProductItem = ({ item }: { item: Product }) => {
  const isLowStock = item.stocks < LOW_STOCK_THRESHOLD;
  
    return (
      <TouchableOpacity 
        onPress={() => router.push({
          pathname: '/productDetails',
          params: { productId: item.id }  
        })}
      >
        <View style={[
          styles.productCard,
          isLowStock && styles.lowStockCard // Apply special styling for low stock
        ]}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.productName}>{item.productName}</Text>
              {isLowStock && (
                <View style={styles.lowStockBadge}>
                  <Text style={styles.lowStockText}>LOW STOCK</Text>
                </View>
              )}
            </View>
            <Text style={styles.productCategory}>{item.category}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="pricetag" size={16} color="#4B3130" />
                <Text style={styles.statText}>₱{item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="cart" size={16} color="#4B3130" />
                <Text style={styles.statText}>{item.sales ?? 0}</Text>
              </View>
              <View style={[
                styles.statItem,
                isLowStock && styles.lowStockStat // Highlight stock number if low
              ]}>
                <Ionicons 
                  name="cube" 
                  size={16} 
                  color={isLowStock ? '#FF3B30' : '#4B3130'} 
                />
                <Text style={[
                  styles.statText,
                  isLowStock && styles.lowStockStatText
                ]}>
                  {item.stocks}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#4B3130" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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

      {/* Stats */}
      <View style={styles.statsContainerWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContent}>
          <View style={styles.statCard}>
            <Ionicons name="grid" size={24} color="#4B3130" />
            <Text style={styles.statCardTitle}>Total Products</Text>
            <Text style={styles.statCardValue}>{products.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cart" size={24} color="#4B3130" />
            <Text style={styles.statCardTitle}>Total Sales</Text>
            <Text style={styles.statCardValue}>
              {products.reduce((sum, product) => sum + (product.sales || 0), 0)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="warning" size={24} color="#4B3130" />
            <Text style={styles.statCardTitle}>Low Stock</Text>
            <Text style={styles.statCardValue}>{products.filter((p) => p.stocks < 20).length}</Text>
          </View>
        </ScrollView>
      </View>

      {/* Product List */}
      <View style={styles.productsListContainer}>
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {products.length === 0
                  ? 'No products in inventory yet.'
                  : 'No products match your search.'}
              </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9D3C3',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4B3130',
    fontFamily: 'Poppins_500Medium',
  },
  lowStockCard: {
  borderLeftWidth: 4,
  borderLeftColor: '#FF3B30',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  lowStockBadge: {
    backgroundColor: '#FFECEC',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  lowStockText: {
    color: '#FF3B30',
    fontSize: 10,
    fontFamily: 'Poppins_600SemiBold',
  },
  lowStockStat: {
    backgroundColor: '#FFECEC',
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  lowStockStatText: {
    color: '#FF3B30',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default ProductsListPage;