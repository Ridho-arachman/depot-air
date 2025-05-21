import { Feather } from "@expo/vector-icons";
import { View, Text, YStack, Button, XStack, Avatar } from "tamagui";
import { useAuth } from "@/hooks/useAuth"; // Impor useAuth
import { useRouter } from "expo-router"; // Impor useRouter
import * as SecureStore from "expo-secure-store"; // Impor SecureStore
import json from "@/data/data.json"; // Impor data JSON
import { useEffect, useState } from "react"; // Impor useEffect dan useState

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
  const { token, setToken } = useAuth(); // Dapatkan token dan fungsi setToken
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        const userIdMatch = token.match(/usr-\d+/);
        let userIsValid = false;

        if (userIdMatch && userIdMatch[0]) {
          const userId = userIdMatch[0];
          const userFromFile = json.users.find((u) => u.id === userId);
          if (userFromFile) {
            setCurrentUser(userFromFile as User);
            userIsValid = true;
          } else {
            console.warn(`User with ID ${userId} not found in data.json. Invalidating token.`);
          }
        } else {
          console.warn("Could not extract user ID from token or token format is unexpected. Invalidating token.");
        }

        if (!userIsValid) {
          setCurrentUser(null);
          setToken(null); // Hapus token dari context
          await SecureStore.deleteItemAsync("token"); // Hapus token dari SecureStore
          // Jika Anda ingin langsung mengarahkan ke login dari sini, uncomment baris berikut:
          // router.replace("/login"); 
          // Namun, biasanya penanganan redirect lebih baik dilakukan di level navigator (misal: _layout.tsx)
          // yang memantau perubahan state token.
        }
      } else {
        setCurrentUser(null); // Tidak ada token, jadi tidak ada pengguna.
      }
    };

    verifyToken();
  }, [token, setToken, router]); // Pastikan dependensi sesuai; router ditambahkan jika digunakan untuk redirect.

  const handleLogout = async () => {
    setToken(null); // Hapus token dari context
    await SecureStore.deleteItemAsync("token"); // Hapus token dari SecureStore
    router.replace("/login"); // Arahkan ke halaman login
  };

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
            /* TODO: Navigasi ke halaman edit profil */
          }}
        />
        <MenuItem
          icon="settings"
          label="Pengaturan"
          onPress={() => {
            /* TODO: Navigasi ke halaman pengaturan */
          }}
        />
        <MenuItem
          icon="help-circle"
          label="Bantuan"
          onPress={() => {
            /* TODO: Navigasi ke halaman bantuan */
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
