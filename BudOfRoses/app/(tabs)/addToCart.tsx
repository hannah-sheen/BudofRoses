import React, { createContext, useContext, useReducer } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/userProductList')}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.cartTitle}>Cart</Text>

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
                ${(item.price * item.quantity).toFixed(2)}
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
              <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
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

export default CartScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4B3130',
    alignSelf: 'flex-start',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  cartTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    fontSize: 16,
  },
  cartItem: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginVertical: 6,
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
  },
  totalText: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 16,
  },
  checkoutButton: {
    marginTop: 10,
    backgroundColor: '#4B3130',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
