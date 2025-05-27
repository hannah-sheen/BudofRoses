// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';
// import React from 'react';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   if (!loaded) {
//     return null;
//   }

// //   return (
// //     <CartProvider>
// //       <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
// //         <Stack>
// //           {/* This defines the tab group */}
// //           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

// //           {/* Optional: Not Found fallback */}
// //           <Stack.Screen name="+not-found" />
// //         </Stack>
// //         <StatusBar style="auto" />
// //       </ThemeProvider>
// //     </CartProvider>
// //   );
// }
