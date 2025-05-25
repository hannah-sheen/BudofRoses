import React, { createContext, useContext, useReducer } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

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
    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.id),
      };
    }
    case 'CLEAR_CART': {
      return { items: [] };
    }
    default:
      return state;
  }
};

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

export const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  const { dispatch } = useCart();

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.productItem}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          <Button
            title="Add to Cart"
            onPress={() => dispatch({ type: 'ADD_TO_CART', product: item, quantity: 1 })}
          />
        </View>
      )}
    />
  );
};

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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
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
        />
      )}
      <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
      <Button title="Checkout" onPress={handleCheckout} />
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
  marginBottom: 10,
  marginTop: 40,
  paddingVertical: 6,
  paddingHorizontal: 12,
  backgroundColor: '#eee',
  alignSelf: 'flex-start',
  borderRadius: 8,
  },
  backButtonText: {
  fontSize: 16,
  color: '#4B0082',
  fontWeight: '600',
  },
  cartTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  productItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
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
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    fontSize: 16,
  },
  totalText: {
    marginTop: 20,
    fontWeight: '600',
    fontSize: 16,
  },
});
