import { H1, Text, XStack, YStack, Button } from "tamagui";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Link } from "expo-router"; // Pastikan baris ini ada dan benar

export function HeaderSection() {
  return (
    <XStack justifyContent="space-between" ai="center">
      <YStack>
        <H1 fontSize="$10" lineHeight="$10" fontWeight="bold" color="$blue11">
          RIDHO FRESH
        </H1>
        <Text fontSize="$4">Depot Air Isi Ulang</Text>
      </YStack>
      <Link href="/keranjang" asChild>
        <Button
          backgroundColor={"white"}
          circular
          icon={<SimpleLineIcons name="basket" size={24} color="black" />}
        />
      </Link>
    </XStack>
  );
}
