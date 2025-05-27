// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Image
// } from 'react-native';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { database } from './firebaseConfig';
// import { ref, onValue, remove } from 'firebase/database';


// type CartItem = {
//   id: string; // This is the Firebase push ID
//   productId: string;
//   productName: string;
//   price: number;
//   quantity: number;
//   totalAmount: number;
//   image?: string;
// };

// export const CartScreen: React.FC = () => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user) {
//       setLoading(false);
//       return;
//     }

//     // First find the username associated with this user
//     const usersRef = ref(database, 'users');
//     const unsubscribeUsers = onValue(usersRef, (snapshot) => {
//       const users = snapshot.val();
//       let username = '';
      
//       for (const key in users) {
//         if (users[key].email === user.email || users[key].uid === user.uid) {
//           username = key;
//           break;
//         }
//       }

//       if (!username) {
//         setLoading(false);
//         return;
//       }

//       // Now listen to the user's cart
//       const cartRef = ref(database, `users/${username}/cart`);
//       const unsubscribeCart = onValue(cartRef, (snapshot) => {
//         const cartData = snapshot.val();
//         const items: CartItem[] = [];
        
//         if (cartData) {
//           Object.keys(cartData).forEach(key => {
//             items.push({
//               id: key,
//               ...cartData[key]
//             });
//           });
//         }

//         setCartItems(items);
//         setLoading(false);
//       });

//       return () => unsubscribeCart();
//     });

//     return () => unsubscribeUsers();
//   }, [user]);

//   const removeFromCart = (itemId: string) => {
//     if (!user) return;

//     // First find the username to get the correct cart reference
//     const usersRef = ref(database, 'users');
//     onValue(usersRef, (snapshot) => {
//       const users = snapshot.val();
//       let username = '';
      
//       for (const key in users) {
//         if (users[key].email === user.email || users[key].uid === user.uid) {
//           username = key;
//           break;
//         }
//       }

//       if (!username) return;

//       const itemRef = ref(database, `users/${username}/cart/${itemId}`);
//       remove(itemRef)
//         .then(() => Alert.alert('Removed', 'Item removed from cart'))
//         .catch(error => Alert.alert('Error', 'Failed to remove item'));
//     }, { onlyOnce: true });
//   };

//   const handleCheckout = () => {
//     if (cartItems.length === 0) {
//       Alert.alert('Cart is empty', 'Please add items before checking out.');
//       return;
//     }

//     Alert.alert('Success', 'Checkout successful!');
//     router.push('/checkout');
//     alert("checkout")
//   };

//   const total = cartItems.reduce((sum, item) => sum + item.totalAmount, 0);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4B3130" />
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.emptyText}>Please log in to view your cart</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => router.push('/(tabs)/userProductList')}>
//             <Ionicons name="arrow-back" size={24} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Cart</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         {cartItems.length === 0 ? (
//           <Text style={styles.emptyText}>Your cart is empty.</Text>
//         ) : (
//           <FlatList
//             data={cartItems}
//             keyExtractor={item => item.id}
//             renderItem={({ item }) => (
//               <View style={styles.cartItem}>
//                 {item.image && (
//                   <Image 
//                     source={{ uri: item.image }} 
//                     style={styles.itemImage}
//                     resizeMode="contain"
//                   />
//                 )}
//                 <View style={styles.itemDetails}>
//                   <Text style={styles.itemText}>{item.productName}</Text>
//                   <Text style={styles.itemPrice}>₱{item.price.toFixed(2)} x {item.quantity}</Text>
//                   <Text style={styles.itemTotal}>₱{item.totalAmount.toFixed(2)}</Text>
//                   <TouchableOpacity
//                     onPress={() => removeFromCart(item.id)}
//                   >
//                     <Text style={styles.removeText}>Remove</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             )}
//             ListFooterComponent={
//               <View style={styles.footerContainer}>
//                 <Text style={styles.totalText}>Total: ₱{total.toFixed(2)}</Text>
//                 <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
//                   <Text style={styles.checkoutText}>Checkout</Text>
//                 </TouchableOpacity>
//               </View>
//             }
//           />
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7F1E5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F7F1E5',
//   },
//   scrollContainer: {
//     paddingBottom: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     backgroundColor: '#4B3130',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 50,
//     paddingBottom: 15,
//     width: '100%',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   emptyText: {
//     fontStyle: 'italic',
//     color: '#888',
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   cartItem: {
//     backgroundColor: '#fff',
//     padding: 12,
//     marginVertical: 6,
//     marginHorizontal: 20,
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   itemImage: {
//     width: 60,
//     height: 60,
//     marginRight: 10,
//   },
//   itemDetails: {
//     flex: 1,
//   },
//   itemText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#4B3130',
//   },
//   itemPrice: {
//     color: '#666',
//     marginVertical: 4,
//   },
//   itemTotal: {
//     color: '#4B3130',
//     fontWeight: '600',
//   },
//   removeText: {
//     color: 'red',
//     marginTop: 4,
//   },
//   footerContainer: {
//     marginTop: 20,
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//     marginHorizontal: 20,
//   },
//   totalText: {
//     marginTop: 10,
//     fontWeight: '600',
//     fontSize: 18,
//     color: '#4B3130',
//     textAlign: 'right',
//   },
//   checkoutButton: {
//     marginTop: 20,
//     backgroundColor: '#4B3130',
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   checkoutText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default CartScreen

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { database } from './firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';

type CartItem = {
  id: string; // Firebase push ID
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  totalAmount: number;
  image?: string;
};

const CartScreen: React.FC = () => {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const cartRef = ref(database, `users/${username}/cart`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const cartData = snapshot.val();
      const items: CartItem[] = [];

      if (cartData) {
        Object.keys(cartData).forEach(key => {
          items.push({
            id: key,
            ...cartData[key],
          });
        });
      }

      setCartItems(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [username]);

  const removeFromCart = (itemId: string) => {
    if (!username) return;

    const itemRef = ref(database, `users/${username}/cart/${itemId}`);
    remove(itemRef)
      .then(() => Alert.alert('Removed', 'Item removed from cart'))
      .catch(() => Alert.alert('Error', 'Failed to remove item'));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is empty', 'Please add items before checking out.');
      return;
    }

    Alert.alert('Success', 'Checkout successful!');
    router.push('/checkout');
  };

  const total = cartItems.reduce((sum, item) => sum + item.totalAmount, 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B3130" />
      </View>
    );
  }

  if (!username) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Please log in to view your cart</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/userProductList')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 24 }} />
        </View>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          data={cartItems}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                  resizeMode="contain"
                />
              )}
              <View style={styles.itemDetails}>
                <Text style={styles.itemText}>{item.productName}</Text>
                <Text style={styles.itemPrice}>₱{(item.price ?? 0).toFixed(2)} x {item.quantity}</Text>
                <Text style={styles.itemTotal}>₱{(item.totalAmount ?? 0).toFixed(2)}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.footerContainer}>
              <Text style={styles.totalText}>Total: ₱{total.toFixed(2)}</Text>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
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
  scrollContainer: {
    paddingBottom: 40,
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
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  cartItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B3130',
  },
  itemPrice: {
    color: '#666',
    marginVertical: 4,
  },
  itemTotal: {
    color: '#4B3130',
    fontWeight: '600',
  },
  removeText: {
    color: 'red',
    marginTop: 4,
  },
  footerContainer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginHorizontal: 20,
  },
  totalText: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 18,
    color: '#4B3130',
    textAlign: 'right',
  },
  checkoutButton: {
    marginTop: 20,
    backgroundColor: '#4B3130',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;
