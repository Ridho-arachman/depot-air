import { Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="bantuan" />
      <Stack.Screen name="edit-profil" />
      <Stack.Screen name="index" />
      <Stack.Screen name="pengaturan" />
    </Stack>
  );
}
