import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  Button,
  YStack,
  ScrollView,
  H1,
  Paragraph,
  XStack,
} from "tamagui";
import json from "@/data/data.json"; // Impor data produk
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Animated, ImageSourcePropType } from "react-native"; // Import ImageSourcePropType

// Definisikan tipe untuk produk agar lebih aman
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

// Definisikan gambar fallback/placeholder menggunakan require
const fallbackImageSource: ImageSourcePropType = require("@/assets/images/icon2.png");

// Buat pemetaan untuk gambar produk lokal (sama seperti di toko.tsx)
// Idealnya, map ini bisa didefinisikan di satu tempat dan diimpor di kedua file
// untuk menghindari duplikasi dan memastikan konsistensi.
const productImageMap: { [key: string]: ImageSourcePropType } = {
  "/images/produk/jasa1.png": require("@/assets/images/produk/jasa1.png"), // Contoh
  "/images/produk/jasa2.png": require("@/assets/images/produk/jasa2.png"), // Contoh
  // Tambahkan semua gambar produk lainnya dari data.json di sini
};

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      const foundProduct = json.products.find((p) => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct as Product);
      } else {
        // Handle jika produk tidak ditemukan, mungkin redirect atau tampilkan pesan error
        console.warn(`Product with ID ${id} not found.`);
        // Contoh: router.replace("/(tabs)/toko");
      }
    }
  }, [id]);

  if (!product) {
    return (
      <View f={1} jc="center" ai="center">
        <Text>Memuat produk...</Text>
      </View>
    );
  }

  let imageToDisplay: ImageSourcePropType = fallbackImageSource; // Default ke gambar fallback

  if (product.image) {
    if (
      product.image.startsWith("http://") ||
      product.image.startsWith("https://")
    ) {
      imageToDisplay = { uri: product.image }; // Untuk gambar dari URL eksternal
    } else if (product.image.startsWith("/")) {
      // Untuk gambar lokal, gunakan pemetaan
      imageToDisplay = productImageMap[product.image] || fallbackImageSource;
    }
  }

  return (
    <View f={1} bg="$background">
      <YStack p="$4" space="$2" marginTop="$10">
        <Image
          source={imageToDisplay}
          width="100%"
          maxHeight={350}
          resizeMode="contain"
          borderRadius="$4"
          bg="$gray5"
        />
        <H1 fontSize="$8" fontWeight="700">
          {product.name}
        </H1>
        <Text fontSize="$7" fontWeight="600" color="$blue10">
          Rp {product.price.toLocaleString("id-ID")}
        </Text>
        <YStack space="$2">
          <Text fontSize="$5" fontWeight="600">
            Deskripsi Produk
          </Text>
          <Paragraph color="$gray11" lineHeight={20}>
            {product.description}
          </Paragraph>
        </YStack>
        <YStack space="$2">
          <Text fontSize="$5" fontWeight="600">
            Stok Tersedia
          </Text>
          <Text color={product.stock > 0 ? "$green10" : "$red10"}>
            {product.stock > 0 ? `${product.stock} unit` : "Stok Habis"}
          </Text>
        </YStack>
        <Button
          icon={<Feather name="shopping-cart" size={20} />}
          theme="blue"
          size="$5"
          disabled={product.stock === 0}
          onPress={() => {
            console.log(`Tambah ${product.name} ke keranjang dari detail`);
          }}
        >
          {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
        </Button>
      </YStack>
    </View>
  );
}
