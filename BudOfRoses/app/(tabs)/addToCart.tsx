import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { database } from './firebaseConfig';
import { ref, onValue, remove, update } from 'firebase/database';
import Checkbox from 'expo-checkbox';

type CartItem = {
  id: string;
  productId: string;
  productName: string; 
  price: number;
  quantity: number;
  totalAmount: number;
  image?: string;     
  selected?: boolean;
};

const CartScreen: React.FC = () => {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(true);

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
            selected: true
          });
        });
      }

      setCartItems(items);
      setLoading(false);
      setSelectAll(items.length > 0);
    });

    return () => unsubscribe();
  }, [username]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    if (!username) return;

    // Find the item in our local state first
    const itemToUpdate = cartItems.find(item => item.id === itemId);
    if (!itemToUpdate) {
      Alert.alert('Error', 'Item not found in cart');
      return;
    }

    const itemPrice = itemToUpdate.price || 0; // Fallback to 0 if price is undefined
    const newTotalAmount = newQuantity * itemPrice;

    const itemRef = ref(database, `users/${username}/cart/${itemId}`);
    update(itemRef, {
      quantity: newQuantity,
      totalAmount: newTotalAmount
    }).catch(() => Alert.alert('Error', 'Failed to update quantity'));
  };

  const removeFromCart = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (!username) return;

            const itemRef = ref(database, `users/${username}/cart/${itemId}`);
            remove(itemRef)
              .then(() => Alert.alert('Removed', 'Item removed from cart'))
              .catch(() => Alert.alert('Error', 'Failed to remove item'));
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  const toggleItemSelection = (itemId: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
    setSelectAll(cartItems.every(item => item.id === itemId ? !item.selected : item.selected));
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        selected: newSelectAll
      }))
    );
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      Alert.alert('No items selected', 'Please select items to checkout.');
      return;
    }

    const selectedTotal = selectedItems.reduce((sum, item) => sum + item.totalAmount, 0);
    
    router.push({
      pathname: '/checkout',
      params: { 
        username: username,
        cartItems: JSON.stringify(selectedItems),
        total: selectedTotal.toFixed(2)
      }
    });
  };

  const total = cartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.totalAmount, 0);

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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push({
          pathname: '/userProductList',
          params: { username: username },
        })}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={48} color="#888" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          {/* Select All checkbox */}
          <View style={styles.selectAllContainer}>
            <Checkbox
              value={selectAll}
              onValueChange={toggleSelectAll}
              style={styles.checkbox}
            />
            <Text style={styles.selectAllText}>Select All</Text>
          </View>

          <FlatList
            data={cartItems}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Checkbox
                  value={item.selected}
                  onValueChange={() => toggleItemSelection(item.id)}
                  style={styles.checkbox}
                />
                <Image 
                  source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
                  style={styles.itemImage}
                  defaultSource={{ uri: 'https://via.placeholder.com/150' }}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.originalPrice}>₱{item.price.toFixed(2)}</Text>
                    <Text style={styles.quantityText}>× {item.quantity}</Text>
                  </View>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                      style={styles.quantityButton} 
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={16} color="#4B3130" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.quantityButton} 
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={16} color="#4B3130" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemTotal}>₱{item.totalAmount.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}
          />
          
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>₱{total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.checkoutButton} 
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4B3130',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
    backgroundColor: '#F7F1E5',
  },
  selectAllText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#4B3130',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B3130',
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0E6D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#4B3130',
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B3130',
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B3130',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4B3130',
  },
  checkoutButton: {
    backgroundColor: '#4B3130',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  priceRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
});

export default CartScreen;