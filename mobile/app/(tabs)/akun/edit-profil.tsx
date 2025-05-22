import { Stack, useRouter } from "expo-router";
import { Button, Text, YStack, Input, ScrollView, Spinner } from "tamagui";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Alert } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import json from "@/data/data.json";

// Definisi tipe User (bisa diimpor jika sudah ada di file terpusat)
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

// Definisi tipe untuk form
interface EditProfileForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function EditProfilScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditProfileForm>();

  useEffect(() => {
    const fetchCurrentUser = () => {
      if (token) {
        const userIdMatch = token.match(/usr-\d+/);
        if (userIdMatch && userIdMatch[0]) {
          const userId = userIdMatch[0];
          const userFromFile = json.users.find((u) => u.id === userId) as User | undefined;
          if (userFromFile) {
            setCurrentUser(userFromFile);
            // Pre-fill form fields
            setValue("name", userFromFile.name);
            setValue("email", userFromFile.email);
            setValue("phone", userFromFile.phone);
            setValue("address", userFromFile.address);
          } else {
            Alert.alert("Error", "Pengguna tidak ditemukan.");
            router.back();
          }
        } else {
          Alert.alert("Error", "Token tidak valid.");
          router.back();
        }
      } else {
        Alert.alert("Error", "Anda harus login terlebih dahulu.");
        router.replace("/login");
      }
      setIsFetchingUser(false);
    };

    fetchCurrentUser();
  }, [token, setValue, router]);

  const onSubmit = (data: EditProfileForm) => {
    if (!currentUser) {
      Alert.alert("Error", "Data pengguna tidak tersedia untuk diperbarui.");
      return;
    }
    setIsLoading(true);
    try {
      // Cari index pengguna di array json.users
      const userIndex = json.users.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        // Update data pengguna
        json.users[userIndex] = {
          ...json.users[userIndex],
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          updatedAt: new Date().toISOString(),
        };
        Alert.alert("Sukses", "Profil berhasil diperbarui.");
        // Update currentUser state agar tampilan di halaman ini juga terupdate jika diperlukan
        setCurrentUser(json.users[userIndex] as User);
        // Anda bisa navigasi kembali atau biarkan pengguna di halaman ini
        // router.back();
      } else {
        Alert.alert("Error", "Gagal memperbarui profil, pengguna tidak ditemukan.");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      Alert.alert("Error", "Terjadi kesalahan saat memperbarui profil.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingUser) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <Spinner size="large" color="$blue10" />
        <Text mt="$2">Memuat data pengguna...</Text>
      </YStack>
    );
  }

  return (
    <ScrollView bg="$background" contentContainerStyle={{ flexGrow: 1 }}>
      <YStack f={1} p="$4" space="$4">
        <Stack.Screen
          options={{
            title: "Edit Profil",
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
        <Text fontSize="$7" fontWeight="bold" ta="center">
          Edit Informasi Profil
        </Text>

        <YStack space="$3">
          <Controller
            control={control}
            name="name"
            rules={{ required: "Nama wajib diisi" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <YStack>
                <Text mb="$1" fontWeight="600">Nama Lengkap</Text>
                <Input
                  placeholder="Nama Lengkap"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.name && <Text color="$red10" fontSize="$2" mt="$1">{errors.name.message}</Text>}
              </YStack>
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email wajib diisi",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Format email tidak valid",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <YStack>
                <Text mb="$1" fontWeight="600">Email</Text>
                <Input
                  placeholder="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && <Text color="$red10" fontSize="$2" mt="$1">{errors.email.message}</Text>}
              </YStack>
            )}
          />

          <Controller
            control={control}
            name="phone"
            rules={{ required: "Nomor telepon wajib diisi" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <YStack>
                <Text mb="$1" fontWeight="600">Nomor Telepon</Text>
                <Input
                  placeholder="Nomor Telepon"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="phone-pad"
                />
                {errors.phone && <Text color="$red10" fontSize="$2" mt="$1">{errors.phone.message}</Text>}
              </YStack>
            )}
          />

          <Controller
            control={control}
            name="address"
            rules={{ required: "Alamat wajib diisi" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <YStack>
                <Text mb="$1" fontWeight="600">Alamat</Text>
                <Input
                  placeholder="Alamat"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top" // Untuk Android agar teks mulai dari atas
                />
                {errors.address && <Text color="$red10" fontSize="$2" mt="$1">{errors.address.message}</Text>}
              </YStack>
            )}
          />
        </YStack>

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading || isFetchingUser}
          icon={isLoading ? () => <Spinner color="$color" /> : undefined}
          theme="blue"
          mt="$2"
        >
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </YStack>
    </ScrollView>
  );
}