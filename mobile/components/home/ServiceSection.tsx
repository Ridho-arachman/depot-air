import { YStack, H2, XStack, ScrollView } from "tamagui";
import { ServiceCard } from "./ServiceCard"; // Pastikan path import benar
import json from "@/data/data.json"; // Sesuaikan jika sumber data berbeda
import { ImageSourcePropType } from "react-native";

// Definisikan tipe Product jika belum ada atau impor dari lokasi sentral
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string; // Path atau URL gambar
  // Tambahkan properti lain jika ada
}

// Definisikan gambar fallback/placeholder (opsional, jika diperlukan)
const fallbackImageSource: ImageSourcePropType = require("@/assets/images/icon2.png");

// Pemetaan gambar lokal jika gambar berasal dari aset (mirip di toko.tsx)
const productImageMap: { [key: string]: ImageSourcePropType } = {
  "/images/produk/jasa1.png": require("@/assets/images/produk/jasa1.png"),
  "/images/produk/jasa2.png": require("@/assets/images/produk/jasa2.png"),
  // Tambahkan pemetaan gambar lainnya jika perlu
};

export function ServiceSection() {
  // Ambil beberapa produk sebagai contoh layanan dari data.json
  // Anda mungkin ingin memfilter atau mengambil data spesifik untuk ServiceSection
  const services: Product[] = json.products.slice(0, 4) as Product[]; // Ambil 4 produk pertama sebagai contoh

  return (
    <YStack mt="$6" gap="$4">
      <H2 fontSize="$9" fontWeight="bold" mb="$2">
        Layanan Kami
      </H2>
      {/* Jika ingin horizontal scroll, bisa gunakan ScrollView horizontal */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack flexWrap="nowrap" gap="$3">
          {services.map((service) => {
            let imageToDisplay: ImageSourcePropType = fallbackImageSource;
            if (service.image) {
              if (service.image.startsWith("http")) {
                imageToDisplay = { uri: service.image };
              } else if (productImageMap[service.image]) {
                imageToDisplay = productImageMap[service.image];
              }
            }

            return (
              <ServiceCard
                key={service.id}
                id={service.id} // Prop 'id' ini sangat penting
                title={service.name}
                price={`Rp ${service.price.toLocaleString("id-ID")}`}
                image={imageToDisplay} // Gunakan imageToDisplay yang sudah diproses
                // Sesuaikan width ServiceCard jika dalam ScrollView horizontal
                // Misalnya, width={180} atau sesuai kebutuhan desain Anda
              />
            );
          })}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
