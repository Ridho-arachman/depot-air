import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import tamaguiConfig from "../tamagui.config";

const queryClient = new QueryClient();
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
          </Stack>
        </ThemeProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
