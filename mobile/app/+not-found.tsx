"use client";

import { YStack, H1, Text, Button } from "tamagui";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";

export default function NotFound() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const goHome = () => {
    router.replace("/");
  };

  return (
    <YStack
      f={1}
      justifyContent="center"
      alignItems="center"
      padding="$6"
      backgroundColor={
        colorScheme === "dark" ? "$backgroundDark" : "$background"
      }
    >
      <H1 fontSize="$10" color="$red10">
        404
      </H1>
      <Text fontSize="$6" color="$gray10" textAlign="center" mt="$4">
        Halaman yang kamu cari tidak ditemukan.
      </Text>
      <Button
        mt="$6"
        size="$4"
        backgroundColor={colorScheme === "dark" ? "$blue5" : "$blue9"}
        onPress={goHome}
      >
        Kembali ke Beranda
      </Button>
    </YStack>
  );
}
