import { Feather } from "@expo/vector-icons";
import { View, Text, YStack, Button, XStack, Avatar, Spinner } from "tamagui";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import json from "@/data/data.json";
import { useEffect, useState, useCallback } from "react";

// Definisikan tipe untuk pengguna agar lebih aman
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export default function AccountScreen() {
  const { token, setToken } = useAuth();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Mulai dengan isLoading true jika kita berencana fetch data saat screen fokus pertama kali
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndSetCurrentUser = useCallback(async () => {
    console.log("AccountScreen: fetchAndSetCurrentUser - Memulai. Token:", token ? "ADA" : "TIDAK ADA");
    // Tidak perlu setIsLoading(true) di sini jika useFocusEffect sudah menanganinya
    // atau jika dipanggil dari useEffect yang sudah set isLoading.
    // Namun, untuk memastikan, kita bisa set di awal.
    setIsLoading(true);

    if (!token) {
      console.log("AccountScreen: fetchAndSetCurrentUser - Tidak ada token. Mengatur currentUser ke null.");
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userIdMatch = token.match(/usr-\d+/);
      if (userIdMatch && userIdMatch[0]) {
        const userId = userIdMatch[0];
        const userFromFile = json.users.find((u) => u.id === userId);

        if (userFromFile) {
          console.log("AccountScreen: fetchAndSetCurrentUser - Pengguna ditemukan:", userFromFile.name);
          setCurrentUser(userFromFile as User);
        } else {
          console.warn(`AccountScreen: fetchAndSetCurrentUser - Pengguna dengan ID ${userId} tidak ditemukan. Token dianggap tidak valid.`);
          setCurrentUser(null);
          setToken(null); // Hapus token dari context
          await SecureStore.deleteItemAsync("token"); // Hapus token dari SecureStore
        }
      } else {
        console.warn("AccountScreen: fetchAndSetCurrentUser - Format token tidak valid. Token dianggap tidak valid.");
        setCurrentUser(null);
        setToken(null);
        await SecureStore.deleteItemAsync("token");
      }
    } catch (error) {
      console.error("AccountScreen: fetchAndSetCurrentUser - Error:", error);
      setCurrentUser(null);
      // Pertimbangkan untuk menghapus token jika error berkaitan dengan validitasnya
      // setToken(null);
      // await SecureStore.deleteItemAsync("token");
    } finally {
      console.log("AccountScreen: fetchAndSetCurrentUser - Selesai.");
      setIsLoading(false);
    }
  }, [token, setToken]); // Hanya bergantung pada token dan setToken

  useFocusEffect(
    useCallback(() => {
      console.log("AccountScreen: FOKUS. Memeriksa token dan memuat data jika perlu.");
      // Selalu set isLoading true saat fokus untuk memicu tampilan loading jika data akan di-fetch
      setIsLoading(true);
      if (token) {
        fetchAndSetCurrentUser();
      } else {
        // Jika tidak ada token saat screen fokus, pastikan user bersih dan tidak loading
        console.log("AccountScreen: FOKUS - Tidak ada token. Mengatur currentUser ke null.");
        setCurrentUser(null);
        setIsLoading(false); // Langsung set false karena tidak ada fetch
      }
      // Cleanup function (opsional, tapi baik untuk dimiliki)
      return () => {
        console.log("AccountScreen: TIDAK FOKUS LAGI (UNFOCUSED)");
        // Anda bisa membatalkan fetch request di sini jika ada
      };
    }, [token, fetchAndSetCurrentUser]) // fetchAndSetCurrentUser sekarang menjadi dependensi
  );
  
  // useEffect ini mungkin tidak lagi diperlukan jika useFocusEffect sudah menangani kasus token null
  // dan pemanggilan fetchAndSetCurrentUser saat token ada.
  // Namun, bisa berguna untuk reaksi awal saat komponen mount jika useFocusEffect tidak langsung jalan
  // atau jika ada logika spesifik saat token berubah di luar konteks fokus.
  // Untuk saat ini, kita coba sederhanakan dan andalkan useFocusEffect.
  /*
  useEffect(() => {
    console.log("AccountScreen: useEffect[token] - Token berubah:", token ? "ADA" : "TIDAK ADA");
    if (!token) {
      setCurrentUser(null);
      setIsLoading(false); // Pastikan loading berhenti jika token hilang
    }
    // Jika token ada, useFocusEffect akan menangani fetch saat screen fokus.
  }, [token]);
  */

  const handleLogout = async () => {
    console.log("AccountScreen: Logout");
    setToken(null);
    await SecureStore.deleteItemAsync("token");
    setCurrentUser(null); // Pastikan state pengguna bersih setelah logout
    router.replace("/login");
  };

  if (isLoading) {
    console.log("AccountScreen: Render - isLoading TRUE");
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <Spinner size="large" color="$blue10" />
        <Text mt="$2">Memuat data pengguna...</Text>
      </YStack>
    );
  }

  // Setelah loading selesai, jika tidak ada currentUser (misalnya, token tidak valid atau tidak ada token)
  // Anda bisa menampilkan pesan atau mengarahkan ke login.
  // Pengarahan ke login mungkin lebih baik ditangani di _layout.tsx (tabs) atau _layout.tsx (root).
  if (!currentUser && !isLoading) { // Pastikan !isLoading untuk menghindari kondisi balapan
    console.log("AccountScreen: Render - isLoading FALSE, currentUser NULL. Pengguna tidak login atau data tidak ada.");
    // Ini bisa menjadi tempat untuk menampilkan pesan "Silakan login" jika tidak ada redirect otomatis
    // Untuk saat ini, kita biarkan agar tidak ada yang dirender jika currentUser null,
    // yang bisa menyebabkan layar putih jika tidak ada token dan tidak ada redirect.
    // Sebaiknya, jika !token, redirect sudah terjadi dari TabLayout.
    // Jika token ada tapi currentUser null (misalnya user tidak ditemukan), tampilkan pesan error.
    if (token) { // Ada token, tapi user tidak ditemukan setelah fetch
        return (
            <YStack f={1} jc="center" ai="center" bg="$background" p="$4">
                <Feather name="alert-circle" size={48} color="$red10" />
                <Text fontSize="$6" mt="$3" ta="center" fontWeight="bold">
                    Gagal Memuat Data Pengguna
                </Text>
                <Text ta="center" mt="$2" color="$gray11">
                    Tidak dapat menemukan informasi pengguna. Silakan coba logout dan login kembali.
                </Text>
                <Button mt="$4" onPress={handleLogout} icon={<Feather name="log-out" />}>
                    Logout
                </Button>
            </YStack>
        );
    }
    // Jika tidak ada token, idealnya sudah di-redirect. Jika belum, ini akan jadi layar putih.
    // Kita bisa tambahkan pesan "Silakan login" di sini sebagai fallback.
    return (
        <YStack f={1} jc="center" ai="center" bg="$background" p="$4">
            <Feather name="info" size={48} color="$blue10" />
            <Text fontSize="$6" mt="$3" ta="center" fontWeight="bold">
                Sesi Tidak Aktif
            </Text>
            <Text ta="center" mt="$2" color="$gray11">
                Silakan login untuk mengakses halaman akun Anda.
            </Text>
            <Button mt="$4" onPress={() => router.replace("/login")} icon={<Feather name="log-in" />}>
                Login
            </Button>
        </YStack>
    );
  }
  
  console.log("AccountScreen: Render - isLoading FALSE, currentUser ADA:", currentUser?.name);
  return (
    <YStack f={1} padding="$4" backgroundColor="$background">
      {/* Header */}
      <YStack ai="center" gap="$2" mb="$6">
        <Avatar circular size="$10">
          <Avatar.Image src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
          <Avatar.Fallback bc="gray" />
        </Avatar>
        <Text fontSize="$7" fontWeight="600">
          {currentUser ? currentUser.name : "Pengguna"}
        </Text>
        <Text color="$gray10">
          {currentUser ? currentUser.phone : "Nomor Telepon Tidak Tersedia"}
        </Text>
      </YStack>

      {/* Menu */}
      <YStack gap="$3">
        <MenuItem
          icon="user"
          label="Profil"
          onPress={() => {
            router.push("/(tabs)/akun/edit-profil");
          }}
        />
        <MenuItem
          icon="settings"
          label="Pengaturan"
          onPress={() => {
            router.push("/(tabs)/akun/pengaturan");
          }}
        />
        <MenuItem
          icon="help-circle"
          label="Bantuan"
          onPress={() => {
            router.push("/(tabs)/akun/bantuan");
          }}
        />
        <MenuItem icon="power" label="Keluar" onPress={handleLogout} />
      </YStack>
    </YStack>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Button
      onPress={onPress}
      backgroundColor="white"
      borderRadius="$4"
      size="$5"
    >
      <XStack ai="center" space="$3" f={1} jc="flex-start">
        <Feather name={icon} size={20} color="#001F54" />
        <Text color="#001F54" fontSize="$5">
          {label}
        </Text>
      </XStack>
      <Feather name="chevron-right" size={20} color="$gray10" />
    </Button>
  );
}
