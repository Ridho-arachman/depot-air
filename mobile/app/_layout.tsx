import { Stack, SplashScreen } from "expo-router"; // Added SplashScreen
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../tamagui.config";
import { useEffect, useState } from "react"; // Added useState
import { useAuth } from "@/hooks/useAuth";
import * as SecureStore from "expo-secure-store";

// Prevent the splash screen from auto-hiding until we're ready.
SplashScreen.preventAutoHideAsync();

// --- MULAI PENAMBAHAN ---
// Contoh implementasi dasar validateToken.
// Untuk sekarang, kita buat selalu mengembalikan false agar tidak auto-login.
// Anda HARUS mengganti ini dengan logika validasi token yang sebenarnya
// (misalnya, memeriksa expiry time, atau validasi ke backend).
async function validateToken(token: string): Promise<boolean> {
  console.log("Memvalidasi token:", token);
  // TODO: Implementasikan logika validasi token yang sesungguhnya di sini.
  // Contoh:
  // 1. Decode token JWT dan cek expiry.
  // 2. Panggil endpoint backend untuk validasi.
  // Untuk sekarang, kita kembalikan false agar tidak otomatis login.
  return false;
}
// --- SELESAI PENAMBAHAN ---

export default function RootLayout() {
  const { setToken } = useAuth();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          const isValid = await validateToken(token);
          if (isValid) {
            setToken(token);
          } else {
            // Token tidak valid, hapus dari penyimpanan
            await SecureStore.deleteItemAsync("token"); // Token dihapus di sini
          }
        }
      } catch (e) {
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
        <Stack.Screen name="keranjang" />
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

// Di dalam komponen RootLayout atau di dalam hook useAuth
const clearToken = async () => {
  try {
    await SecureStore.deleteItemAsync("token");
  } catch (e) {
    console.warn("Failed to clear token:", e);
  }
};
