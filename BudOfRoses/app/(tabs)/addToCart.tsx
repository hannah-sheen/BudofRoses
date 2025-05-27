import React, { createContext, useContext, useReducer } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Navbar from './navBar';


// Types
type Product = {
  id: string;
  name: string;
  price: number;
};

type CartItem = Product & { quantity: number };

type CartState = {
  items: CartItem[];
};

type Action =
  | { type: 'ADD_TO_CART'; product: Product; quantity: number }
  | { type: 'REMOVE_FROM_CART'; id: string }
  | { type: 'CLEAR_CART' };

// Reducer
const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(item => item.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + action.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.product, quantity: action.quantity }],
        };
      }
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.id),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

// Context
const CartContext = createContext<{
  cart: CartState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });
  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

// Cart Screen
export const CartScreen: React.FC = () => {
  const navigation = useNavigation();
  const { cart, dispatch } = useCart();
  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      Alert.alert('Cart is empty', 'Please add items before checking out.');
      return;
    }

    Alert.alert('Success', 'Checkout successful!');
    router.replace('/(tabs)/checkout');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/userProductList')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 24 }} />
        </View>

        {cart.items.length === 0 ? (
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        ) : (
          <FlatList
            data={cart.items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Text style={styles.itemText}>
                  {item.name} x {item.quantity}
                </Text>
                <Text style={styles.itemPrice}>
                  ₱{(item.price * item.quantity).toFixed(2)}
                </Text>
                <TouchableOpacity
                  onPress={() => dispatch({ type: 'REMOVE_FROM_CART', id: item.id })}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
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
        
      </ScrollView>
      <Navbar/>
    </View>
  );
};

export default CartScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D3C3',
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
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 16,
  },
  itemPrice: {
    color: '#555',
    marginBottom: 4,
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
    fontSize: 16,
  },
  checkoutButton: {
    marginTop: 10,
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