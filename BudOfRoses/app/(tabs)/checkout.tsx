// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { database } from './firebaseConfig';
// import { ref, push, set, update , get} from 'firebase/database';

// type CartItem = {
//   productId: string;
//   productName: string;
//   price: number;
//   quantity: number;
//   totalAmount: number;
//   image: string;
// };

// const CheckoutScreen = () => {
//   const { username, cartItems: cartItemsString, total } = useLocalSearchParams<{
//     username: string;
//     cartItems: string;
//     total: string;
//   }>();
  
//   const [loading, setLoading] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState<'cod' | 'gcash'>('cod');
  
//   // Parse the cart items from the string parameter
//   const cartItems: CartItem[] = cartItemsString ? JSON.parse(cartItemsString) : [];
//   const totalAmount = parseFloat(total || '0');

//   const handlePlaceOrder = async () => {
//       if (!username || cartItems.length === 0) {
//         Alert.alert('Error', 'Invalid order data');
//         return;
//       }

//       setLoading(true);
      
//       try {
//         // Create order in database
//         const ordersRef = ref(database, `orders`);
//         const newOrderRef = push(ordersRef);
        
//         const orderData = {
//           customerId: username,
//           items: cartItems,
//           total: totalAmount,
//           paymentMethod: selectedPayment,
//           status: 'pending',
//           date: new Date().toISOString(),
//         };
        
//         await set(newOrderRef, orderData);
        
//         // Remove purchased items from cart
//         const cartRef = ref(database, `users/${username}/cart`);
//         const cartSnapshot = await get(cartRef);
//         const cartData = cartSnapshot.val();
        
//         if (cartData) {
//           // Explicitly type the updates object
//           const updates: { [key: string]: null } = {};
          
//           cartItems.forEach(item => {
//             const cartItemKey = Object.keys(cartData).find(
//               key => cartData[key].productId === item.productId
//             );
//             if (cartItemKey) {
//               updates[`users/${username}/cart/${cartItemKey}`] = null;
//             }
//           });
          
//           await update(ref(database), updates);
//         }
      
//         Alert.alert(
//           'Order Placed', 
//           'Your order has been placed successfully!',
//           [
//             { 
//               text: 'OK', 
//               onPress: () => router.replace({
//                 pathname: '/userProductList',
//                 params: { username }
//               })
//             }
//           ]
//         );
//       } catch (error) {
//         console.error('Error placing order:', error);
//         Alert.alert('Error', 'Failed to place order');
//       } finally {
//         setLoading(false);
//       }
//     };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4B3130" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Checkout</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Order Summary */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Order Summary</Text>
//         {cartItems.map((item, index) => (
//           <View key={index} style={styles.orderItem}>
//             <Image 
//               source={{ uri: item.image }} 
//               style={styles.itemImage}
//               defaultSource={{ uri: 'https://via.placeholder.com/150' }}
//             />
//             <View style={styles.itemDetails}>
//               <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
//               <Text style={styles.itemPrice}>₱{item.price.toFixed(2)} × {item.quantity}</Text>
//             </View>
//             <Text style={styles.itemTotal}>₱{item.totalAmount.toFixed(2)}</Text>
//           </View>
//         ))}
//       </View>

//       {/* Payment Method */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Payment Method</Text>
//         <TouchableOpacity 
//           style={[
//             styles.paymentOption, 
//             selectedPayment === 'cod' && styles.selectedPayment
//           ]}
//           onPress={() => setSelectedPayment('cod')}
//         >
//           <Ionicons 
//             name={selectedPayment === 'cod' ? 'radio-button-on' : 'radio-button-off'} 
//             size={20} 
//             color="#4B3130" 
//           />
//           <Text style={styles.paymentText}>Cash on Delivery</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[
//             styles.paymentOption, 
//             selectedPayment === 'gcash' && styles.selectedPayment
//           ]}
//           onPress={() => setSelectedPayment('gcash')}
//         >
//           <Ionicons 
//             name={selectedPayment === 'gcash' ? 'radio-button-on' : 'radio-button-off'} 
//             size={20} 
//             color="#4B3130" 
//           />
//           <Text style={styles.paymentText}>GCash</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Total */}
//       <View style={styles.totalContainer}>
//         <Text style={styles.totalLabel}>Total Amount:</Text>
//         <Text style={styles.totalAmount}>₱{totalAmount.toFixed(2)}</Text>
//       </View>

//       {/* Place Order Button */}
//       <TouchableOpacity 
//         style={styles.placeOrderButton}
//         onPress={handlePlaceOrder}
//         disabled={loading}
//       >
//         <Text style={styles.placeOrderText}>Place Order</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#F7F1E5',
//     paddingBottom: 30,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F7F1E5',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#4B3130',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     marginBottom: 20,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   section: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 16,
//     marginHorizontal: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#4B3130',
//     marginBottom: 12,
//   },
//   orderItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   itemImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 4,
//     marginRight: 12,
//   },
//   itemDetails: {
//     flex: 1,
//   },
//   itemName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#4B3130',
//     marginBottom: 4,
//   },
//   itemPrice: {
//     fontSize: 12,
//     color: '#888',
//   },
//   itemTotal: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#4B3130',
//   },
//   paymentOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   selectedPayment: {
//     backgroundColor: '#F0E6D2',
//   },
//   paymentText: {
//     fontSize: 14,
//     color: '#4B3130',
//     marginLeft: 8,
//   },
//   totalContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 16,
//     marginHorizontal: 16,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   totalLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#4B3130',
//   },
//   totalAmount: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#4B3130',
//   },
//   placeOrderButton: {
//     backgroundColor: '#4B3130',
//     borderRadius: 8,
//     paddingVertical: 16,
//     marginHorizontal: 16,
//     alignItems: 'center',
//   },
//   placeOrderText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default CheckoutScreen;


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { database } from './firebaseConfig';
import { ref, push, set, update, get } from 'firebase/database';

type OrderItem = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  totalAmount: number;
  image: string;
  category?: string;
  stocks?: number;
};

type UserData = {
  firstName: string;
  lastName: string;
};

const CheckoutScreen = () => {
  const { username, orderDetails } = useLocalSearchParams<{
    username: string;
    orderDetails: string;
  }>();
  
  const [loading, setLoading] = useState(false);
  const shippingFee = 80; // Fixed shipping fee of ₱80
  
  // Parse the order details from the string parameter
  const orderItem: OrderItem = orderDetails ? JSON.parse(orderDetails) : null;
  const subtotal = orderItem ? orderItem.price * orderItem.quantity : 0;
  const totalAmount = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    if (!username || !orderItem) {
      Alert.alert('Error', 'Invalid order data');
      return;
    }

    setLoading(true);
    
    try {
      // Get customer details first
      const userRef = ref(database, `users/${username}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        throw new Error('User not found');
      }
      
      const userData: UserData = {
        firstName: userSnapshot.val().firstName,
        lastName: userSnapshot.val().lastName
      };

      // Create order in database with simplified structure
      const ordersRef = ref(database, `orders`);
      const newOrderRef = push(ordersRef);
      
      const orderData = {
        itemName: orderItem.productName,
        quantity: orderItem.quantity,
        itemPrice: orderItem.price,
        totalAmount: totalAmount,
        dateOrdered: new Date().toISOString(),
        productImage: orderItem.image,
        customerName: `${userData.firstName} ${userData.lastName}`,
        customerUsername: username,
      };
      
      await set(newOrderRef, orderData);
      
      // Update product stock
      const productRef = ref(database, `productlist/${orderItem.productId}`);
      const productSnapshot = await get(productRef);
      
      if (productSnapshot.exists()) {
        const currentStock = productSnapshot.val().stocks || 0;
        const newStock = currentStock - orderItem.quantity;
        
        await update(productRef, { stocks: Math.max(0, newStock) });
      }
    
      Alert.alert(
        'Order Placed', 
        'Your order has been placed successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => router.replace({
              pathname: '/userProductList',
              params: { username }
            })
          }
        ]
      );
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B3130" />
      </View>
    );
  }

  if (!orderItem) {
    return (
      <View style={styles.container}>
        <Text>No order details found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.orderItem}>
          <Image 
            source={{ uri: orderItem.image }} 
            style={styles.itemImage}
            defaultSource={{ uri: 'https://via.placeholder.com/150' }}
          />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={1}>{orderItem.productName}</Text>
            <Text style={styles.itemCategory}>Category: {orderItem.category}</Text>
            <Text style={styles.itemPrice}>₱{orderItem.price.toFixed(2)} × {orderItem.quantity}</Text>
          </View>
          <Text style={styles.itemTotal}>₱{(orderItem.price * orderItem.quantity).toFixed(2)}</Text>
        </View>
      </View>

      {/* Order Totals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Total</Text>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>₱{subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Shipping Fee:</Text>
          <Text style={styles.totalValue}>₱{shippingFee.toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text style={styles.grandTotalLabel}>Total:</Text>
          <Text style={styles.grandTotalValue}>₱{totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity 
        style={styles.placeOrderButton}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        <Text style={styles.placeOrderText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F7F1E5',
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F1E5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4B3130',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B3130',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B3130',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B3130',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#4B3130',
  },
  totalValue: {
    fontSize: 14,
    color: '#4B3130',
  },
  grandTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B3130',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B3130',
  },
  placeOrderButton: {
    backgroundColor: '#4B3130',
    borderRadius: 8,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen;