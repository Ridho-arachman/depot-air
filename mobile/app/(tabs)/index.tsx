import { ScrollView, View } from "tamagui";
import { HeaderSection } from "@/components/home/HeaderSection";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceSection } from "@/components/home/ServiceSection";
import { AboutSection } from "@/components/home/AboutSection";
import { LocationSection } from "@/components/home/LocationSection";

export default function Index() {
  return (
    <ScrollView pt="$6">
      <View mx="$4" mb="$15">
        <HeaderSection />
        <HeroSection />
        <ServiceSection />
        <AboutSection />
        <LocationSection />
      </View>
    </ScrollView>
  );
}
