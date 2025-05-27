// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   Alert,
//   ScrollView,
// } from 'react-native';
// // import { useCart } from '../(tabs)/addToCart';
// import { useNavigation } from '@react-navigation/native';
// import { router } from 'expo-router';

// const Checkout = () => {
// //   const { cart, dispatch } = useCart();
//   const navigation = useNavigation();

//   const [name, setName] = useState('');
//   const [address, setAddress] = useState('');
//   const [email, setEmail] = useState('');

// //   const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   const handlePlaceOrder = () => {
//     if (!name || !address || !email) {
//       Alert.alert('Missing Information', 'Please fill out all fields.');
//       return;
//     }

//     if (cart.items.length === 0) {
//       Alert.alert('Cart is Empty', 'Please add items to your cart before placing an order.');
//       return;
//     }

//     Alert.alert('Order Placed', `Thank you, ${name}! Your order total is $${totalPrice.toFixed(2)}`);
//     dispatch({ type: 'CLEAR_CART' });

//     setName('');
//     setAddress('');
//     setEmail('');

//     router.replace('/(tabs)/userProductList');
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Checkout</Text>

//       {cart.items.length === 0 ? (
//         <Text style={styles.emptyCart}>Your cart is empty.</Text>
//       ) : (
//         cart.items.map(item => (
//           <View key={item.id} style={styles.item}>
//             <Text style={styles.itemText}>{item.name} x {item.quantity}</Text>
//             <Text style={styles.itemText}>${(item.price * item.quantity).toFixed(2)}</Text>
//           </View>
//         ))
//       )}

//       <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>

//       <Text style={styles.label}>Name</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your name"
//         value={name}
//         onChangeText={setName}
//       />

//       <Text style={styles.label}>Address</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your address"
//         value={address}
//         onChangeText={setAddress}
//       />

//       <Text style={styles.label}>Email</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <Button title="Place Order" onPress={handlePlaceOrder} />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   heading: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   item: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   itemText: {
//     fontSize: 16,
//   },
//   total: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginVertical: 20,
//   },
//   label: {
//     fontSize: 14,
//     marginTop: 10,
//   },
//   input: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     marginTop: 4,
//     borderRadius: 6,
//     marginBottom: 10,
//   },
//   emptyCart: {
//     fontSize: 16,
//     color: '#888',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
// });

// export default Checkout;
