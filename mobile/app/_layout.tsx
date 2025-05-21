import { Stack, SplashScreen } from "expo-router"; // Added SplashScreen
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../tamagui.config";
import { useEffect, useState } from "react"; // Added useState
import { useAuth } from "@/hooks/useAuth";
import * as SecureStore from "expo-secure-store";

// Prevent the splash screen from auto-hiding until we're ready.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setToken } = useAuth();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          setToken(token);
        }
      } catch (e) {
        // Here, you might want to log the error or handle it appropriately
        console.warn("Failed to initialize auth:", e);
      } finally {
        setIsAuthInitialized(true);
      }
    };

    initializeAuth();
  }, [setToken]); // Added setToken to dependency array

  useEffect(() => {
    if (isAuthInitialized) {
      // Hide the splash screen now that we are ready to render.
      SplashScreen.hideAsync();
    }
  }, [isAuthInitialized]);

  if (!isAuthInitialized) {
    // Return null or a custom loading component while auth is initializing
    // SplashScreen.preventAutoHideAsync() will keep the native splash screen visible.
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />

        <Stack.Screen
          name="login"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </TamaguiProvider>
  );
}
