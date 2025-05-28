// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, FlatList, TouchableOpacity,
//   Image, TextInput, SafeAreaView, ActivityIndicator
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
// import Navbar from './navBar';
// import { database } from './firebaseConfig';
// import { ref, onValue } from 'firebase/database';
// import { useLocalSearchParams } from 'expo-router';

// type Product = {
//   id: string;
//   productName: string;
//   image: string;
//   price: number;
//   category: string;
//   sales: number;
//   stocks: number;
// };

// const UserProductsListPage = () => {
//   const { username } = useLocalSearchParams<{ username: string }>();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const [fontsLoaded] = useFonts({
//     Poppins_400Regular,
//     Poppins_600SemiBold,
//     Poppins_700Bold,
//   });

//   useEffect(() => {
//     const productsRef = ref(database, 'productlist');
//     const unsubscribe = onValue(productsRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const productsArray = Object.keys(data).map(key => ({
//           id: key,
//           ...data[key]
//         }));
//         setProducts(productsArray);
//       } else {
//         setProducts([]);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (!fontsLoaded || loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4B3130" />
//       </View>
//     );
//   }

//   const filteredProducts = products.filter(product =>
//     product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     product.category.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handlePressProduct = (product: Product) => {
//     router.push({
//       pathname: '/viewProduct',
//       params: { 
//         productId: product.id,
//         username: username 
//       }
//     });
//   };

//   const renderProductItem = ({ item }: { item: Product }) => (
//     <TouchableOpacity style={styles.gridItem} onPress={() => handlePressProduct(item)}>
//       <View style={styles.imageContainer}>
//         <Image 
//           source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
//           style={styles.gridImage} 
//           defaultSource={{ uri: 'https://via.placeholder.com/150' }}
//         />
//       </View>
//       <Text style={styles.gridText} numberOfLines={1}>{item.productName}</Text>
//       <Text style={styles.priceText}>₱{item.price.toFixed(2)}</Text>
//     </TouchableOpacity>
//   );

//   return(
//     <SafeAreaView style={styles.container}>
//     {/* Header and Content */}
//     <View style={{flex: 1}}>
//       {/* Header */}
//      <View style={styles.header}>
//         <Text style={styles.headerTitle}>Bud of Roses</Text>
//         <TouchableOpacity
//           style={styles.cartButton}
//           onPress={() =>
//             router.push({
//               pathname: '/addToCart',
//               params: { username: username },
//             })
//           }
//         >
//           <Ionicons name="cart-outline" size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Search */}
//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={20} color="#4B3130" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search flowers..."
//           placeholderTextColor="#A6A6A6"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       {/* Product Grid */}
//       <View style={styles.contentContainer}>
//         {filteredProducts.length > 0 ? (
//           <FlatList
//             data={filteredProducts}
//             renderItem={renderProductItem}
//             keyExtractor={(item) => item.id}
//             numColumns={2}
//             contentContainerStyle={styles.gridList}
//             showsVerticalScrollIndicator={false}
//           />
//         ) : (
//           <View style={styles.emptyContainer}>
//             <Ionicons name="flower-outline" size={50} color="#4B3130" />
//             <Text style={styles.emptyText}>No products found</Text>
//           </View>
//         )}
//       </View>
//     </View>
    
//     {/* Navbar at the very bottom */}
//     <View style={styles.navbar}>
//       <Navbar username={username}/>
//     </View>
//   </SafeAreaView>
//  )
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#F8F5F0',
//     justifyContent: 'space-between', // This will push header to top and navbar to bottom
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F8F5F0',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between', 
//     paddingHorizontal: 16,
//     paddingVertical: 15,
//     backgroundColor: '#4B3130',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   headerTitle: {
//     fontSize: 24, 
//     fontFamily: 'Poppins_700Bold', 
//     color: '#FFFFFF',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//   },
//   searchContainer: {
//     flexDirection: 'row', 
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF', 
//     marginHorizontal: 24,
//     marginVertical: 16,
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1, 
//     height: 48, 
//     color: '#4B3130', 
//     fontSize: 16,
//     fontFamily: 'Poppins_400Regular', 
//   },
//   contentContainer: {
//     flex: 1,
//     marginBottom: 0, // Ensure no extra margin
//   },
//   gridList: {
//     paddingHorizontal: 16,
//   },
//   gridItem: {
//     flex: 1,
//     maxWidth: '48%', // Allow for spacing between items
//     backgroundColor: '#fff', 
//     margin: 6,
//     borderRadius: 12,
//     alignItems: 'center', 
//     padding: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   imageContainer: {
//     width: '100%',
//     aspectRatio: 1,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#F0F0F0',
//     marginBottom: 8,
//   },
//   gridImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   gridText: {
//     width: '100%',
//     fontSize: 14, 
//     fontFamily: 'Poppins_600SemiBold', 
//     color: '#4B3130',
//     textAlign: 'center',
//     marginVertical: 4,
//   },
//   priceText: {
//     fontSize: 16,
//     fontFamily: 'Poppins_700Bold',
//     color: '#DBA6B6',
//     marginTop: 2,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontFamily: 'Poppins_600SemiBold',
//     color: '#4B3130',
//     marginTop: 16,
//     textAlign: 'center',
//   },
//   navbar: {
//     paddingBottom: 0,
//   },
//   cartButton: {
//   padding: 6,
// }
// });

// export default UserProductsListPage;

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, TextInput, SafeAreaView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import Navbar from './navBar';
import { database } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useLocalSearchParams } from 'expo-router';

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
  const { username } = useLocalSearchParams<{ username: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
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
      params: { 
        productId: product.id,
        username: username 
      }
    });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.gridItem} onPress={() => handlePressProduct(item)}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
          style={styles.gridImage} 
          defaultSource={{ uri: 'https://via.placeholder.com/150' }}
        />
      </View>
      <Text style={styles.gridText} numberOfLines={1}>{item.productName}</Text>
      <Text style={styles.priceText}>₱{item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return(
    <SafeAreaView style={styles.container}>
      {/* Header and Content */}
      <View style={{flex: 1}}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bud of Roses</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#4B3130" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search flowers..."
            placeholderTextColor="#A6A6A6"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Product Grid */}
        <View style={styles.contentContainer}>
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.gridList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="flower-outline" size={50} color="#4B3130" />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Navbar at the very bottom */}
      <View style={styles.navbar}>
        <Navbar username={username}/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F5F0',
    justifyContent: 'space-between', // This will push header to top and navbar to bottom
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F5F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    padding: 15,
    backgroundColor: '#4B3130',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 20, 
    fontFamily: 'Poppins_700Bold', 
    color: '#FFFFFF',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1, 
    height: 48, 
    color: '#4B3130', 
    fontSize: 16,
    fontFamily: 'Poppins_400Regular', 
  },
  contentContainer: {
    flex: 1,
    marginBottom: 0, // Ensure no extra margin
  },
  gridList: {
    paddingHorizontal: 16,
  },
  gridItem: {
    flex: 1,
    maxWidth: '48%', // Allow for spacing between items
    backgroundColor: '#fff', 
    margin: 6,
    borderRadius: 12,
    alignItems: 'center', 
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    marginBottom: 8,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gridText: {
    width: '100%',
    fontSize: 14, 
    fontFamily: 'Poppins_600SemiBold', 
    color: '#4B3130',
    textAlign: 'center',
    marginVertical: 4,
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#DBA6B6',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#4B3130',
    marginTop: 16,
    textAlign: 'center',
  },
  navbar: {
    paddingBottom: 0,
  },
});

export default UserProductsListPage;
