import { LinearGradient } from "tamagui/linear-gradient";
import { XStack, YStack, Text, Image } from "tamagui";
import { homeAssets } from "@/constants/homeAssets";

export function HeroSection() {
  return (
    <LinearGradient
      colors={["$blue10", "$blue1"]}
      start={[0, 1]}
      end={[1, 0]}
      mt="$4"
      borderRadius={20}
    >
      <XStack
        backgroundColor="$colorTransparent"
        padding="$4"
        alignItems="center"
        borderRadius="$6"
        width="100%"
        alignSelf="center"
      >
        <YStack flex={1} maxWidth="77%" paddingRight="$3" gap="$2">
          <Text color="white" fontSize="$6" fontWeight="bold">
            Selamat datang di Ridho Fresh!
          </Text>
          <Text>Pesan Air Isi Ulang Dengan Mudah</Text>
        </YStack>
        <YStack flex={1} maxWidth="23%" alignItems="center">
          <Image
            source={homeAssets.hero}
            width={150}
            height={150}
            resizeMode="contain"
          />
        </YStack>
      </XStack>
    </LinearGradient>
  );
}
