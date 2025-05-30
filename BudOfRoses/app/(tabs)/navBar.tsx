import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';

export default function Navbar({ username }: { username: string }) {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    // Optionally render nothing or a fallback while font loads
    return null;
  }

  return (
    <View style={styles.navbar}>
      <Link href={{
          pathname: "/userOrderHistory",
          params: { username: username },
        }}
        asChild
        >
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="clipboard-outline" size={24} color="#ffff" />
          <Text style={styles.navLabel}>Orders</Text>
        </TouchableOpacity>
      </Link>

      {/* Profile link with username parameter */}
      <Link
        href={{
          pathname: "/profile",
          params: { username: username },
        }}
        asChild
      >
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="person-outline" size={24} color="#fff" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#4B3130",
    borderColor: "#ccc",
    position: "absolute",
    paddingTop: 10,
    bottom: 0,
    width: "100%",
  },
  navButton: {
    alignItems: "center",
  },
  navLabel: {
    color: "#fff",
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    marginTop: 4,
  },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "red",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 10,
  },
});
