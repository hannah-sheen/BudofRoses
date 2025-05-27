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

          {/* <Link href="/addToCart" asChild>
            <TouchableOpacity>
              <View>
                <Ionicons name="cart-outline" size={24} color="#F7F1E5" /> */}
                {/* {cartItemCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                  </View>
                )} */}
              {/* </View>
            </TouchableOpacity>
          </Link> */}

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
