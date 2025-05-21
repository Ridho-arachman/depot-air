import { ScrollView, View, Button, YStack } from "tamagui";
import { HeaderSection } from "@/components/home/HeaderSection";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceSection } from "@/components/home/ServiceSection";
import { AboutSection } from "@/components/home/AboutSection";
import { LocationSection } from "@/components/home/LocationSection";
import { useAuth } from "@/hooks/useAuth"; // Impor useAuth
import { Link } from "expo-router"; // Impor Link untuk navigasi
import { Feather } from "@expo/vector-icons"; // Impor Feather untuk ikon

export default function Index() {
  const { isAuthenticated } = useAuth(); // Dapatkan status autentikasi

  return (
    <ScrollView pt="$6" backgroundColor="$background">
      <View mx="$4" mb="$15">
        <HeaderSection />
        {!isAuthenticated && ( // Tampilkan tombol jika belum login
          <YStack
            my="$4"
            ai="center" // Pusatkan item di dalam YStack (tombol)
            alignSelf="stretch" // Buat YStack mengambil lebar penuh yang tersedia
          >
            <Link href="/login" asChild>
              <Button
                theme="blue"
                icon={<Feather name="log-in" size={16} />}
                size="$4"
                width="80%" // Atur lebar tombol menjadi 80% dari parent (YStack)
                // Anda juga bisa menggunakan nilai tetap dari Tamagui seperti width="$20" jika lebih disukai
              >
                Login untuk Melanjutkan
              </Button>
            </Link>
          </YStack>
        )}
        <HeroSection />
        <ServiceSection />
        <AboutSection />
        <LocationSection />
      </View>
    </ScrollView>
  );
}
