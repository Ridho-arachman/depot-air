import { YStack, H2, XStack, Paragraph } from "tamagui";
import Feather from "@expo/vector-icons/Feather";

export function AboutSection() {
  return (
    <YStack mt="$6" gap="$4">
      <H2 fontSize="$9" fontWeight="bold">
        Tentang
      </H2>
      <XStack
        gap="$4"
        maxWidth="100%"
        backgroundColor="$gray6Light"
        borderRadius="$4"
        justifyContent="center"
        alignContent="center"
        padding="$4"
        mx="auto"
      >
        <Feather
          name="info"
          size={100}
          color="blue"
          style={{ maxWidth: "300%" }}
        />
        <Paragraph color="$blue6" fontSize="$6" maxWidth="60%" mt="$2">
          Depot air isi ulang Ridho Fresh menyediakan layanan pengisian air
          minum dengan kualitas terbaik
        </Paragraph>
      </XStack>
    </YStack>
  );
}
