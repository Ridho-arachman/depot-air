import { Tabs } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "expo-router";
import { useEffect } from "react";
import { Feather } from "@expo/vector-icons";

// Add type definition for the tab bar icon props
type TabBarIconProps = {
  color: string;
  size: number;
};

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Jika bukan di halaman index dan belum login, redirect ke login
    if (
      !isAuthenticated &&
      pathname !== "/(tabs)/" &&
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/produk/")
    ) {
      // Izinkan akses ke halaman produk detail meskipun belum login
      if (
        pathname === "/(tabs)/pesanan" ||
        pathname === "/(tabs)/akun" ||
        pathname === "/(tabs)/toko" ||
        pathname === "/(tabs)/keranjang"
      ) {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, pathname, router]);

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="toko" // Pindahkan Toko ke posisi kedua untuk alur yang lebih umum
        options={{
          title: "Toko",
          // href: isAuthenticated ? "/(tabs)/toko" : null, // Selalu tampilkan, logika redirect di atas
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Feather name="shopping-bag" size={size} color={color} /> // Mengganti ikon toko
          ),
        }}
      />
      <Tabs.Screen
        name="keranjang" // Tambahkan tab Keranjang
        options={{
          title: "Keranjang",
          href: isAuthenticated ? "/(tabs)/keranjang" : null, // Sembunyikan jika belum login
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Feather name="shopping-cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pesanan"
        options={{
          title: "Pesanan",
          href: isAuthenticated ? "/(tabs)/pesanan" : null,
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Feather name="package" size={size} color={color} /> // Mengganti ikon pesanan
          ),
        }}
      />
      <Tabs.Screen
        name="akun"
        options={{
          title: "Akun",
          href: isAuthenticated ? "/(tabs)/akun" : null,
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
      {/* Hapus Tab Toko yang lama jika sudah dipindahkan */}
    </Tabs>
  );
}
