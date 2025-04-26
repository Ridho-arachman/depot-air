import { H1, Text, XStack, YStack, Button } from "tamagui";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

export function HeaderSection() {
  return (
    <XStack justifyContent="space-between">
      <YStack>
        <H1 fontSize="$10" lineHeight="$10" fontWeight="bold" color="$blue11">
          RIDHO FRESH
        </H1>
        <Text fontSize="$4">Depot Air Isi Ulang</Text>
      </YStack>
      <Button backgroundColor={"white"}>
        <SimpleLineIcons name="basket" size={24} color="black" />
      </Button>
    </XStack>
  );
}
