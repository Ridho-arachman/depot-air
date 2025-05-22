import { View, Text, XStack, YStack, Button, Image, ScrollView } from "tamagui";
import { Link } from "expo-router";
import { useState } from "react";
import json from "@/data/data.json";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { Alert, ImageSourcePropType } from "react-native"; // Import ImageSourcePropType

// Definisikan tipe untuk produk agar lebih aman saat digunakan
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

// Definisikan tipe untuk item dalam pesanan
interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product; // Menggunakan Product interface yang sudah ada
  quantity: number;
  price: number;
  subtotal: number;
}

// Definisikan tipe untuk detail pembayaran berdasarkan pesan error
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

// Definisikan tipe untuk pesanan
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

// Buat pemetaan untuk gambar produk lokal. Anda PERLU mengisi ini
// dengan semua gambar produk Anda yang berasal dari data.json.
// Path string (kunci) harus sama persis dengan nilai product.image dari data.json.
// Path require (nilai) harus menunjuk ke lokasi aset yang benar.
const productImageMap: { [key: string]: ImageSourcePropType } = {
  "/images/produk/jasa1.png": require("@/assets/images/produk/jasa1.png"), // Contoh, pastikan file ini ada
  "/images/produk/jasa2.png": require("@/assets/images/produk/jasa2.png"), // Contoh, pastikan file ini ada
  // Tambahkan semua gambar produk lainnya dari data.json di sini
  // Misalnya: "/images/produk/nama-gambar-lain.png": require("@/assets/images/produk/nama-gambar-lain.png"),
};

export default function Produk() {
  const [products, setProducts] = useState<Product[]>(
    json.products as Product[]
  );
  const { token } = useAuth(); // Dapatkan token pengguna

  const getUserIdFromToken = (authToken: string | null): string | null => {
    if (!authToken) return null;
    // Asumsi format token: "dummy-token-for-usr-xxx"
    const userIdMatch = authToken.match(/usr-\d+/);
    return userIdMatch && userIdMatch[0] ? userIdMatch[0] : null;
  };

  const handleAddToCart = (productToAdd: Product) => {
    const userId = getUserIdFromToken(token);

    if (!userId) {
      Alert.alert(
        "Gagal",
        "Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang."
      );
      return;
    }

    if (productToAdd.stock <= 0) {
      Alert.alert("Stok Habis", "Maaf, stok produk ini sudah habis.");
      return;
    }

    // Cari produk di katalog utama untuk memastikan data terbaru
    const productInCatalog = json.products.find(
      (p) => p.id === productToAdd.id
    ) as Product | undefined; // Pastikan productInCatalog juga bertipe Product
    if (!productInCatalog || productInCatalog.stock <= 0) {
      Alert.alert("Stok Habis", "Maaf, stok produk ini baru saja habis.");
      // Perbarui tampilan jika ada perbedaan
      setProducts([...json.products] as Product[]);
      return;
    }

    let userOrder = json.orders.find(
      (o: any) => o.userId === userId && o.status === "pending"
    ) as Order | undefined; // Beri tipe eksplisit pada userOrder

    const productSnapshot: Product = {
      // Snapshot detail produk saat ditambahkan, pastikan tipenya Product
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
        // Beri tipe eksplisit pada newOrderItem
        id: newOrderItemId,
        orderId: newOrderId,
        productId: productInCatalog.id,
        product: productSnapshot,
        quantity: 1,
        price: productInCatalog.price, // Harga saat item ditambahkan
        subtotal: productInCatalog.price,
      };

      userOrder = {
        // Tipe Order sekarang mengizinkan payment: null
        id: newOrderId,
        userId: userId,
        items: [newOrderItem],
        totalAmount: newOrderItem.subtotal,
        status: "pending",
        payment: null, // Ini sekarang valid karena Order.payment bisa null
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // Jika json.orders belum memiliki tipe yang kuat, Anda mungkin perlu cast saat push
      (json.orders as Order[]).push(userOrder);
    } else {
      // Tambahkan ke pesanan yang sudah ada
      const existingItem = userOrder.items.find(
        (item) => item.productId === productInCatalog.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
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
        } as OrderItem); // Cast ke OrderItem jika perlu
      }
      userOrder.totalAmount = userOrder.items.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      userOrder.updatedAt = new Date().toISOString();
    }

    // Kurangi stok di katalog produk utama
    productInCatalog.stock -= 1;
    productInCatalog.updatedAt = new Date().toISOString();

    // Perbarui state produk di komponen untuk me-render ulang tampilan
    setProducts([...json.products] as Product[]);

    console.log("Updated json.orders:", JSON.stringify(json.orders, null, 2));
    console.log(
      "Updated json.products:",
      JSON.stringify(
        json.products.find((p) => p.id === productToAdd.id),
        null,
        2
      )
    );

    Alert.alert(
      "Sukses",
      `${productInCatalog.name} telah ditambahkan ke keranjang.`
    );
  };

  return (
    <YStack f={1} bg="$background" p="$4">
      {/* Header */}
      <Text fontSize="$8" fontWeight="700" mb="$4">
        Produk
      </Text>

      {/* Banner */}
      <View
        bg="$blue4"
        p="$4"
        borderRadius="$4"
        mb="$4"
        ai="center"
        jc="center"
      >
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2917/2917991.png",
          }}
          width={100}
          height={100}
          resizeMode="contain"
        />
        <Text fontSize="$6" fontWeight="700" mt="$2">
          Air Isi Ulang
        </Text>
        <Text fontSize="$3" color="$gray11" textAlign="center">
          Air minum berkualitas isi ulang
        </Text>
      </View>

      {/* List Produk */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {products.map((product) => {
          let imageToDisplay: ImageSourcePropType = fallbackImageSource; // Default ke gambar fallback

          if (product.image) {
            if (
              product.image.startsWith("http://") ||
              product.image.startsWith("https://")
            ) {
              imageToDisplay = { uri: product.image }; // Untuk gambar dari URL eksternal
            } else if (product.image.startsWith("/")) {
              // Untuk gambar lokal, gunakan pemetaan
              imageToDisplay =
                productImageMap[product.image] || fallbackImageSource;
            }
          }

          return (
            <XStack
              key={product.id}
              bg="$color1"
              borderRadius="$4"
              p="$3"
              mb="$3"
              ai="center"
              jc="space-between"
            >
              <XStack ai="center" f={1} mr="$2">
                <Image
                  source={imageToDisplay} // Gunakan imageToDisplay yang sudah ditentukan
                  width={50}
                  height={50}
                  borderRadius={8}
                />
                <YStack ml="$3" f={1}>
                  <Text
                    fontSize="$5"
                    fontWeight="600"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {product.name}
                  </Text>
                  <Text fontSize="$3" color="$gray11">
                    Rp {product.price.toLocaleString("id-ID")} (Stok:{" "}
                    {product.stock})
                  </Text>
                </YStack>
              </XStack>

              <XStack space="$2" ai="center">
                <Link
                  href={{
                    pathname: "/produk/[id]",
                    params: { id: product.id },
                  }}
                  asChild
                >
                  <Button
                    size="$3"
                    variant="outlined"
                    icon={<Feather name="eye" size={16} />}
                    // Apply direct styles for a gray outlined button
                    borderColor="$gray8" // Example: using a gray token for the border
                    color="$gray11" // Example: using a gray token for text/icon color
                    // The 'variant="outlined"' prop will handle the transparent background
                  >
                    Detail
                  </Button>
                </Link>
                <Button
                  size="$3"
                  // Apply direct styles for a blue button
                  backgroundColor={product.stock > 0 ? "$blue9" : "$gray6"} // Warna tombol berdasarkan stok
                  color="$white" // Example: white text color
                  borderColor={product.stock > 0 ? "$blue7" : "$gray5"} // Optional: border for the blue button
                  onPress={() => handleAddToCart(product)}
                  disabled={product.stock === 0} // Nonaktifkan tombol jika stok habis
                >
                  {product.stock > 0 ? "Tambah" : "Habis"}
                </Button>
              </XStack>
            </XStack>
          );
        })}
      </ScrollView>
    </YStack>
  );
}
