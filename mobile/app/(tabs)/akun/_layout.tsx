import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="akun" />
      <Stack.Screen name="edit-profil" />
      <Stack.Screen name="pengaturan" />
      <Stack.Screen name="bantuan" />
    </Stack>
  );
}
