import { Stack, useRouter } from "expo-router";
import {
  Button,
  Text,
  YStack,
  ScrollView,
  H4,
  Separator,
  Switch,
  XStack,
  Paragraph,
  useTheme, // Untuk mendapatkan tema saat ini (opsional, jika ingin menampilkan status tema)
} from "tamagui";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Alert } from "react-native";

export default function PengaturanScreen() {
  const router = useRouter();
  const theme = useTheme(); // Mendapatkan tema Tamagui saat ini

  // State untuk pengaturan (simulasi, tidak disimpan permanen)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  // Fix for ts(2367): Ensure theme.name is treated as a string for comparison
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    String(theme.name) === "dark"
  ); // Inisialisasi berdasarkan tema Tamagui
  const [selectedLanguage, setSelectedLanguage] = useState("Indonesia");

  const handleClearCache = () => {
    Alert.alert(
      "Hapus Cache",
      "Apakah Anda yakin ingin menghapus cache aplikasi? (Simulasi)",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          onPress: () => console.log("Cache dibersihkan (simulasi)"),
        },
      ]
    );
  };

  // Fungsi untuk mengubah tema (simulasi, tidak mengubah tema Tamagui secara global di sini)
  const toggleDarkMode = (enabled: boolean) => {
    setDarkModeEnabled(enabled);
    Alert.alert(
      "Mode Gelap",
      `Mode gelap ${
        enabled ? "diaktifkan" : "dinonaktifkan"
      }. (Simulasi, perlu implementasi tema global)`
    );
    // Untuk implementasi nyata, Anda perlu memanggil fungsi dari ThemeProvider Anda
    // contoh: toggleTheme(enabled ? 'dark' : 'light');
  };

  return (
    <ScrollView bg="$background" f={1}>
      <YStack p="$4" space="$4">
        <Stack.Screen
          options={{
            title: "Pengaturan Aplikasi",
            headerLeft: () => (
              <Button
                icon={<Feather name="chevron-left" size={24} />}
                onPress={() => router.back()}
                chromeless
                paddingLeft={0}
              />
            ),
          }}
        />
        <H4 ta="center" mb="$2">
          Pengaturan
        </H4>

        {/* Pengaturan Notifikasi */}
        <YStack space="$3" p="$3" borderRadius="$4" bg="$backgroundFocus">
          <Text fontSize="$6" fontWeight="600">
            Notifikasi
          </Text>
          <Separator />
          <XStack ai="center" jc="space-between" mt="$2">
            <Paragraph>Aktifkan Notifikasi Pesanan</Paragraph>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
              size="$4"
            >
              <Switch.Thumb animation="quick" />
            </Switch>
          </XStack>
          <Paragraph fontSize="$2" color="$gray10">
            Dapatkan pemberitahuan tentang status pesanan Anda.
          </Paragraph>
        </YStack>

        {/* Pengaturan Tampilan */}
        <YStack
          space="$3"
          p="$3"
          borderRadius="$4"
          bg="$backgroundFocus"
          mt="$4"
        >
          <Text fontSize="$6" fontWeight="600">
            Tampilan
          </Text>
          <Separator />
          <XStack ai="center" jc="space-between" mt="$2">
            <Paragraph>Mode Gelap</Paragraph>
            <Switch
              checked={darkModeEnabled}
              onCheckedChange={toggleDarkMode}
              size="$4"
            >
              <Switch.Thumb animation="quick" />
            </Switch>
          </XStack>
          <Paragraph fontSize="$2" color="$gray10">
            Ubah tema aplikasi menjadi mode gelap atau terang.
          </Paragraph>
        </YStack>

        {/* Pengaturan Bahasa */}
        <YStack
          space="$3"
          p="$3"
          borderRadius="$4"
          bg="$backgroundFocus"
          mt="$4"
        >
          <Text fontSize="$6" fontWeight="600">
            Bahasa
          </Text>
          <Separator />
          <XStack ai="center" jc="space-between" mt="$2">
            <Paragraph>Pilih Bahasa</Paragraph>
            <Button
              size="$3"
              onPress={() =>
                Alert.alert(
                  "Pilih Bahasa",
                  "Fitur pilih bahasa belum tersedia."
                )
              }
            >
              {selectedLanguage} <Feather name="chevron-right" size={16} />
            </Button>
          </XStack>
        </YStack>

        {/* Pengaturan Lainnya */}
        <YStack
          space="$3"
          p="$3"
          borderRadius="$4"
          bg="$backgroundFocus"
          mt="$4"
        >
          <Text fontSize="$6" fontWeight="600">
            Lainnya
          </Text>
          <Separator />
          {/* Fix for ts(2322): Change theme name to a valid one, e.g., "red" */}
          <Button
            theme="red"
            mt="$2"
            onPress={handleClearCache}
            iconAfter={<Feather name="trash-2" size={16} />}
          >
            Hapus Cache Aplikasi
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
