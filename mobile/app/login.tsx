import { View, YStack, Text, Input, Button } from "tamagui";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import json from "@/data/data.json"; // Impor data JSON
import { Alert } from "react-native"; // Impor Alert
import { useAuth } from "@/hooks/useAuth"; // Impor useAuth
import * as SecureStore from "expo-secure-store"; // Impor SecureStore
import { Link } from "expo-router";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth(); // Dapatkan fungsi setToken dari useAuth
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      console.log("Login data from form:", data);

      const user = json.users.find(
        (u) => u.email.toLowerCase() === data.email.toLowerCase()
      );

      if (user) {
        const simulatedPasswordInDb = user.passwordHash.replace(
          "simulated-hash-",
          ""
        );
        if (simulatedPasswordInDb === data.password) {
          console.log("Login successful for user:", user);

          // Buat token dummy untuk simulasi
          const dummyToken = `dummy-token-for-${user.id}`;

          // Set token menggunakan useAuth dan simpan ke SecureStore
          setToken(dummyToken);
          await SecureStore.setItemAsync("token", dummyToken);

          Alert.alert(
            "Login Berhasil",
            `Selamat datang kembali, ${user.name}!`
          );
          router.replace("/(tabs)");
        } else {
          console.log("Invalid password for email:", data.email);
          Alert.alert("Login Gagal", "Password yang Anda masukkan salah.");
        }
      } else {
        console.log("User not found with email:", data.email);
        Alert.alert("Login Gagal", "Email tidak ditemukan.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat login.";
      Alert.alert("Login Gagal", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View f={1} p="$4" bg="$background" jc="center">
      <YStack space="$4" maw={600} w="100%">
        <Link href="/(tabs)">
          <Text ta="center" fow="700" fos="$8">
            Ridho Fresh
          </Text>
        </Link>
        <YStack space="$3">
          <Controller
            control={control}
            name="email"
            rules={{ required: "Email wajib diisi" }}
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
            name="password"
            rules={{ required: "Password wajib diisi" }}
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
        </YStack>

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          bg="$blue10"
          color="white"
        >
          {isLoading ? "Memuat..." : "Masuk"}
        </Button>

        <Button
          variant="outlined"
          onPress={() => router.push("/register")}
          disabled={isLoading}
        >
          Daftar Akun Baru
        </Button>
      </YStack>
    </View>
  );
}
