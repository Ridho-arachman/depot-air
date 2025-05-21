import { View, YStack, Text, Input, Button } from "tamagui";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import json from "@/data/data.json";
import { Alert } from "react-native"; // Tambahkan import Alert

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();
  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      console.log("Raw register data from form:", data);

      // Membuat objek pengguna baru sesuai struktur di data.json
      const newUser = {
        id: `usr-${Date.now()}`, // ID unik sederhana untuk simulasi
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: "user", // Default role untuk pengguna baru
        passwordHash: `simulated-hash-${data.password}`, // Menambahkan passwordHash (simulasi)
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Password tidak disimpan langsung di data.json dalam contoh ini,
        // biasanya di-hash dan disimpan secara aman di backend.
      };

      json.users.push(newUser);

      console.log("Updated data.json structure after registration (in-memory):", json);
      // TODO: Implementasi register API
      // Di sini Anda akan mengirimkan 'newUser' ke backend API Anda.
      // Untuk sekarang, kita hanya akan log data pengguna baru yang akan dikirim.
      console.log(
        "Simulating API call with new user data (to be 'inserted' into data.json structure):",
        newUser
      );

      // Memberikan feedback sukses kepada pengguna
      Alert.alert(
        "Registrasi Berhasil (Simulasi)",
        "Pengguna baru telah ditambahkan ke data di memori. Perubahan ini tidak permanen dan akan hilang jika aplikasi dimulai ulang."
      );

      router.replace("/login");
    } catch (error) {
      console.error("Register error:", error);
      // Memberikan feedback error kepada pengguna
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan tidak diketahui";
      Alert.alert("Registrasi Gagal", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View f={1} p="$4" bg="$background">
      <YStack space="$4" maw={600} w="100%">
        <Text ta="center" fow="700" fos="$8">
          Daftar Akun Baru
        </Text>

        <YStack space="$3">
          <Controller
            control={control}
            name="name"
            rules={{ required: "Nama wajib diisi" }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nama Lengkap"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.name && <Text color="$red10">{errors.name.message}</Text>}

          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email wajib diisi",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email tidak valid",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && <Text color="$red10">{errors.email.message}</Text>}

          <Controller
            control={control}
            name="phone"
            rules={{ required: "Nomor telepon wajib diisi" }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nomor Telepon"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.phone && <Text color="$red10">{errors.phone.message}</Text>}

          <Controller
            control={control}
            name="address"
            rules={{ required: "Alamat wajib diisi" }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Alamat"
                multiline
                numberOfLines={3}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.address && (
            <Text color="$red10">{errors.address.message}</Text>
          )}

          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password wajib diisi",
              minLength: { value: 6, message: "Password minimal 6 karakter" },
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.password && (
            <Text color="$red10">{errors.password.message}</Text>
          )}

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: "Konfirmasi password wajib diisi",
              validate: (value) => value === password || "Password tidak cocok",
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Konfirmasi Password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text color="$red10">{errors.confirmPassword.message}</Text>
          )}
        </YStack>

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          bg="$blue10"
          color="white"
        >
          {isLoading ? "Memuat..." : "Daftar"}
        </Button>

        <Button
          variant="outlined"
          onPress={() => router.back()}
          disabled={isLoading}
        >
          Kembali ke Login
        </Button>
      </YStack>
    </View>
  );
}
