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

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // Dapatkan ID produk dari parameter
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
        {/* Atau bisa juga tampilkan ActivityIndicator */}
      </View>
    );
  }

  // Fallback image jika product.image tidak valid atau kosong
  const imageUrl =
    product.image && product.image.startsWith("/")
      ? `https://cdn-icons-png.flaticon.com/512/2917/2917991.png` // Ganti dengan URL default yang sesuai
      : product.image ||
        "https://cdn-icons-png.flaticon.com/512/2917/2917991.png"; // Ganti dengan URL default yang sesuai

  return (
    <ScrollView f={1} bg="$background" contentContainerStyle={{ flexGrow: 1 }}>
      <Stack.Screen
        options={{
          title: product.name,
          headerLeft: () => (
            <Button
              icon={<Feather name="chevron-left" size={24} />}
              onPress={() => router.back()}
              chromeless
              paddingLeft={0}
            />
          ),
        }}
      />
      <YStack p="$4" space="$4">
        <Image
          source={{ uri: imageUrl }}
          width="100%"
          aspectRatio={1} // Membuat gambar persegi
          borderRadius="$4"
          resizeMode="cover" // atau 'contain' sesuai preferensi
          bg="$gray5" // Background color sementara gambar dimuat
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
            // TODO: Implementasi logika tambah ke keranjang
            console.log(`Tambah ${product.name} ke keranjang`);
          }}
        >
          {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
        </Button>
      </YStack>
    </ScrollView>
  );
}