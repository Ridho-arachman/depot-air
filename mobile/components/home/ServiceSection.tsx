import { YStack, H2, XStack } from "tamagui";
import { ServiceCard } from "./ServiceCard";
import { homeAssets } from "@/constants/homeAssets";

export function ServiceSection() {
  return (
    <YStack mt="$6" gap="$4">
      <H2 fontSize="$9" fontWeight="bold">
        Jasa
      </H2>
      <XStack justifyContent="flex-start" gap="$4" flexWrap="wrap" mx="auto">
        <ServiceCard
          title="Isi Ulang Galon 19 Liter"
          price="RP. 5.000"
          image={homeAssets.jasa1}
        />
        <ServiceCard
          title="Isi Ulang Galon 19 Liter"
          price="RP. 5.000"
          image={homeAssets.jasa2}
        />
        <ServiceCard
          title="Galon 19 L"
          price="RP. 5.000"
          image={homeAssets.jasa2}
        />
      </XStack>
    </YStack>
  );
}
