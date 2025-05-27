// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import React from 'react';

// import ProductsListPage from './userProductList';
// import Profile from './profile';
// import OrderStatus from './orderStatus';

// const Tab = createBottomTabNavigator();

// export default function TabsLayout() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: '#ACBA96',
//         tabBarInactiveTintColor: '#4B3130',
//         tabBarStyle: {
//           backgroundColor: '#fff',
//           borderTopColor: '#ddd',
//           height: 65,
//           paddingBottom: 8,
//           paddingTop: 8,
//         },
//         tabBarIcon: ({ color, size }) => {
//           let iconName = 'home';
//           if (route.name === 'Profile') iconName = 'person';
//           else if (route.name === 'Order Status') iconName = 'clipboard-outline';
//           return <Ionicons name={iconName as any} size={24} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={ProductsListPage} />
//       <Tab.Screen name="Profile" component={Profile} />
//       <Tab.Screen name="Order Status" component={OrderStatus} />
//     </Tab.Navigator>
//   );
// }

import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function Navbar(){
  return(
    <View style={styles.navbar}>

          <Link href="/userProductList" asChild>
            <TouchableOpacity>
              <Ionicons name="home-outline" size={24} color="#F7F1E5" />
            </TouchableOpacity>
          </Link>

          <Link href="/addToCart" asChild>
            <TouchableOpacity>
              <View>
                <Ionicons name="cart-outline" size={24} color="#F7F1E5" />
                {/* {cartItemCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                  </View>
                )} */}
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/orderStatus">
            <TouchableOpacity>
              <Ionicons name="clipboard-outline" size={24} color="#F7F1E5" />
            </TouchableOpacity>
          </Link>

          <Link href="/profile" asChild>
            <TouchableOpacity>
              <Ionicons name="person-outline" size={24} color="#F7F1E5" />
            </TouchableOpacity>
          </Link>
          </View>
  )
}

const styles = StyleSheet.create({
    navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ACBA96',
    paddingVertical: 10,
    marginBottom: 45,
    borderTopWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
  },
})
