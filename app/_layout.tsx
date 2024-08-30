// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { useEffect } from "react";
// import {
//   ApolloClient,
//   InMemoryCache,
//   ApolloProvider,
//   gql,
// } from "@apollo/client";
// import "react-native-reanimated";

// import { useColorScheme } from "@/hooks/useColorScheme";

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// const client = new ApolloClient({
//   uri: "https://arcelet.us-east-a.ibm.stepzen.net/api/brazen-gibbon/__graphql",
//   cache: new InMemoryCache(),
//   headers: {
//     Authorization:
//       "APIKey arcelet::local.net+1000::051befad4c06b78f518aea78a8c7017b9dd1049b2a091bab8ba9a755acc2d7f5",
//   },
// });

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ApolloProvider client={client}>
//       <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//         <Stack>
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           <Stack.Screen name="+not-found" />
//         </Stack>
//       </ThemeProvider>
//     </ApolloProvider>
//   );
// }

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const client = new ApolloClient({
  uri: "https://arcelet.us-east-a.ibm.stepzen.net/api/brazen-gibbon/__graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization:
      "APIKey arcelet::local.net+1000::051befad4c06b78f518aea78a8c7017b9dd1049b2a091bab8ba9a755acc2d7f5",
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* The (tabs) screen handles all the tabbed navigation */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Place your Search screen here outside of the tabs */}
          <Stack.Screen name="Search" options={{ headerShown: false }} />

          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </ApolloProvider>
  );
}
