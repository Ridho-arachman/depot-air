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
import { Animated, ImageSourcePropType, Alert } from "react-native"; // Import ImageSourcePropType AND Alert
import { useAuth } from "@/hooks/useAuth"; // Import useAuth

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

// Definisikan tipe tambahan yang diperlukan untuk logika keranjang
interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product; // Menggunakan Product interface yang sudah ada
  quantity: number;
  price: number; // Harga produk saat ditambahkan ke keranjang
  subtotal: number;
}

interface PaymentDetails {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  paymentUrl?: string;
  paymentToken?: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  payment: PaymentDetails | null; // Izinkan null untuk pembayaran
  createdAt: string;
  updatedAt: string;
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
  const { token } = useAuth(); // Dapatkan token pengguna

  // Fungsi untuk mendapatkan User ID dari token
  const getUserIdFromToken = (authToken: string | null): string | null => {
    if (!authToken) return null;
    const userIdMatch = authToken.match(/usr-\d+/);
    return userIdMatch && userIdMatch[0] ? userIdMatch[0] : null;
  };

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

  const handleAddToCart = (productToAdd: Product) => {
    if (!productToAdd) return;

    const userId = getUserIdFromToken(token);

    if (!userId) {
      Alert.alert(
        "Gagal",
        "Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang."
      );
      // Arahkan ke halaman login jika diperlukan
      // router.push("/login");
      return;
    }

    // Cari produk di katalog utama untuk memastikan data stok terbaru
    const productInCatalog = json.products.find(
      (p) => p.id === productToAdd.id
    ) as Product | undefined;

    if (!productInCatalog) {
      Alert.alert("Error", "Produk tidak ditemukan di katalog.");
      return;
    }

    if (productInCatalog.stock <= 0) {
      Alert.alert("Stok Habis", "Maaf, stok produk ini sudah habis.");
      // Perbarui state produk lokal jika stok berubah dari sumber lain
      setProduct(productInCatalog);
      return;
    }

    let userOrder = (json.orders as Order[]).find(
      (o) => o.userId === userId && o.status === "pending"
    );

    const productSnapshot: Product = {
      id: productInCatalog.id,
      name: productInCatalog.name,
      price: productInCatalog.price,
      image: productInCatalog.image,
      description: productInCatalog.description,
      stock: productInCatalog.stock, // Stok saat item ditambahkan
    };

    if (!userOrder) {
      // Buat pesanan baru jika tidak ada yang pending
      const newOrderItemId = `itm-${Date.now()}`;
      const newOrderId = `ord-${Date.now()}`;

      const newOrderItem: OrderItem = {
        id: newOrderItemId,
        orderId: newOrderId,
        productId: productInCatalog.id,
        product: productSnapshot,
        quantity: 1,
        price: productInCatalog.price,
        subtotal: productInCatalog.price,
      };

      userOrder = {
        id: newOrderId,
        userId: userId,
        items: [newOrderItem],
        totalAmount: newOrderItem.subtotal,
        status: "pending",
        payment: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (json.orders as Order[]).push(userOrder);
    } else {
      // Tambahkan ke pesanan yang sudah ada
      const existingItemIndex = userOrder.items.findIndex(
        (item) => item.productId === productInCatalog.id
      );

      if (existingItemIndex > -1) {
        userOrder.items[existingItemIndex].quantity += 1;
        userOrder.items[existingItemIndex].subtotal =
          userOrder.items[existingItemIndex].quantity *
          userOrder.items[existingItemIndex].price;
      } else {
        const newOrderItemId = `itm-${Date.now() + 1}`; // Pastikan ID unik
        userOrder.items.push({
          id: newOrderItemId,
          orderId: userOrder.id,
          productId: productInCatalog.id,
          product: productSnapshot,
          quantity: 1,
          price: productInCatalog.price,
          subtotal: productInCatalog.price,
        });
      }
      userOrder.totalAmount = userOrder.items.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      userOrder.updatedAt = new Date().toISOString();
    }

    // Kurangi stok di katalog produk utama
    const productCatalogIndex = json.products.findIndex(
      (p) => p.id === productInCatalog.id
    );
    if (productCatalogIndex > -1) {
      json.products[productCatalogIndex].stock -= 1;
      json.products[productCatalogIndex].updatedAt = new Date().toISOString();
      // Perbarui state produk di halaman detail untuk merefleksikan stok baru
      setProduct({ ...json.products[productCatalogIndex] });
    }

    Alert.alert(
      "Sukses",
      `${productToAdd.name} telah ditambahkan ke keranjang.`
    );
    // Anda bisa menambahkan navigasi ke keranjang di sini jika diinginkan
    // router.push("/keranjang");
  };

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
            if (product) {
              handleAddToCart(product);
            }
          }}
        >
          {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
        </Button>
      </YStack>
    </View>
  );
}
