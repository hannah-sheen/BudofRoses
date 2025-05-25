import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import ProductsListPage from './userProductList';
import Profile from './profile';
import OrderStatus from './orderStatus';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ACBA96',
        tabBarInactiveTintColor: '#4B3130',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#ddd',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'Order Status') iconName = 'clipboard-outline';
          return <Ionicons name={iconName as any} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={ProductsListPage} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Order Status" component={OrderStatus} />
    </Tab.Navigator>
  );
}
