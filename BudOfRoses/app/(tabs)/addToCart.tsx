import React, { createContext, useContext, useReducer } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';

// --- Types ---
type Product = {
  id: string;
  name: string;
  price: number;
};

type CartItem = Product & { quantity: number };

type CartState = {
  [x: string]: any;
  items: CartItem[];
};

type Action =
  | { type: 'ADD_TO_CART'; product: Product; quantity: number }
  | { type: 'REMOVE_FROM_CART'; id: string }
  | { type: 'CLEAR_CART' };

// --- Reducer ---
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

// --- Context ---
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

// --- ProductList ---
export const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  const { dispatch } = useCart();

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text>{item.name}</Text>
          <Text>${item.price.toFixed(2)}</Text>
          <Button
            title="Add to Cart"
            onPress={() => dispatch({ type: 'ADD_TO_CART', product: item, quantity: 1 })}
          />
        </View>
      )}
    />
  );
};

// --- CartScreen ---
export const CartScreen: React.FC = () => {
  const { cart, dispatch } = useCart();
  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Cart</Text>
      {cart.items.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cart.items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8 }}>
              <Text>{item.name} x {item.quantity}</Text>
              <Text>${(item.price * item.quantity).toFixed(2)}</Text>
              <TouchableOpacity
                onPress={() => dispatch({ type: 'REMOVE_FROM_CART', id: item.id })}
              >
                <Text style={{ color: 'red' }}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <Text style={{ marginTop: 20 }}>Total: ${total.toFixed(2)}</Text>
      <Button
        title="Checkout"
        onPress={() => {
          alert('Checkout successful!');
          dispatch({ type: 'CLEAR_CART' });
        }}
      />
    </View>
  );
};

export default CartScreen;
