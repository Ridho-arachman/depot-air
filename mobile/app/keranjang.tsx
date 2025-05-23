import { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  YStack,
  XStack,
  Image,
  H1,
  Paragraph,
  Separator,
} from "tamagui";
import { Stack, useRouter, Link } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import json from "@/data/data.json";
import { Feather } from "@expo/vector-icons";
import { Alert } from "react-native";
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused

// Menggunakan kembali interface yang sudah ada dari toko.tsx atau definisikan di sini jika perlu
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

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
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
  payment: PaymentDetails | null;
  createdAt: string;
  updatedAt: string;
}

export default function KeranjangScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [userOrder, setUserOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused(); // Gunakan hook useIsFocused

  const getUserIdFromToken = (authToken: string | null): string | null => {
    if (!authToken) return null;
    const userIdMatch = authToken.match(/usr-\d+/);
    return userIdMatch && userIdMatch[0] ? userIdMatch[0] : null;
  };

  useEffect(() => {
    // Hanya jalankan jika layar sedang fokus atau token berubah
    if (isFocused) {
      setIsLoading(true); // Set loading true saat mulai fetch
      const userId = getUserIdFromToken(token);
      if (userId) {
        // Cari order 'pending' dari json.orders yang dimutasi
        const order = (json.orders as Order[]).find(
          (o) => o.userId === userId && o.status === "pending"
        );
        setUserOrder(order || null);
      } else {
        setUserOrder(null); 
      }
      setIsLoading(false);
    }
  }, [token, isFocused, json.orders]); // Tambahkan isFocused dan json.orders sebagai dependency
                                    // json.orders ditambahkan untuk kasus jika ada perubahan lain pada orders
                                    // yang tidak terkait fokus, meskipun fokus adalah pemicu utama di sini.

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (!userOrder) return;

    const itemIndex = userOrder.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;

    const productInCatalog = json.products.find(
      (p) => p.id === userOrder.items[itemIndex].productId
    ) as Product | undefined;
    if (!productInCatalog) {
      Alert.alert("Error", "Produk tidak ditemukan di katalog.");
      return;
    }

    const quantityDifference =
      newQuantity - userOrder.items[itemIndex].quantity;

    if (quantityDifference > 0 && productInCatalog.stock < quantityDifference) {
      Alert.alert(
        "Stok Tidak Cukup",
        `Hanya tersisa ${productInCatalog.stock} unit untuk ${productInCatalog.name}.`
      );
      return;
    }

    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const updatedItems = [...userOrder.items];
    updatedItems[itemIndex].quantity = newQuantity;
    updatedItems[itemIndex].subtotal =
      newQuantity * updatedItems[itemIndex].price;

    productInCatalog.stock -= quantityDifference;
    productInCatalog.updatedAt = new Date().toISOString();

    const newTotalAmount = updatedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const updatedOrder = {
      ...userOrder,
      items: updatedItems,
      totalAmount: newTotalAmount,
      updatedAt: new Date().toISOString(),
    };
    setUserOrder(updatedOrder);

    const orderInJsonIndex = (json.orders as Order[]).findIndex(
      (o) => o.id === userOrder.id
    );
    if (orderInJsonIndex !== -1) {
      (json.orders as Order[])[orderInJsonIndex] = updatedOrder;
    }
  };

  const removeItem = (itemId: string) => {
    if (!userOrder) return;

    const itemToRemove = userOrder.items.find((item) => item.id === itemId);
    if (!itemToRemove) return;

    const productInCatalog = json.products.find(
      (p) => p.id === itemToRemove.productId
    ) as Product | undefined;
    if (productInCatalog) {
      productInCatalog.stock += itemToRemove.quantity;
      productInCatalog.updatedAt = new Date().toISOString();
    }

    const updatedItems = userOrder.items.filter((item) => item.id !== itemId);
    const newTotalAmount = updatedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const updatedOrder = {
      ...userOrder,
      items: updatedItems,
      totalAmount: newTotalAmount,
      updatedAt: new Date().toISOString(),
    };

    if (updatedItems.length === 0) {
      setUserOrder(updatedOrder); 
      const orderInJsonIndex = (json.orders as Order[]).findIndex(
        (o) => o.id === userOrder.id
      );
      if (orderInJsonIndex !== -1) {
        (json.orders as Order[])[orderInJsonIndex] = updatedOrder; 
      }
    } else {
      setUserOrder(updatedOrder);
      const orderInJsonIndex = (json.orders as Order[]).findIndex(
        (o) => o.id === userOrder.id
      );
      if (orderInJsonIndex !== -1) {
        (json.orders as Order[])[orderInJsonIndex] = updatedOrder;
      }
    }
    Alert.alert(
      "Item Dihapus",
      `${itemToRemove.product.name} telah dihapus dari keranjang.`
    );
  };

  if (isLoading) {
    return (
      <View f={1} jc="center" ai="center">
        <Text>Memuat keranjang...</Text>
      </View>
    );
  }

  // Kondisi untuk menampilkan keranjang kosong jika userOrder null atau items kosong
  if (!userOrder || userOrder.items.length === 0) {
    return (
      <YStack f={1} ai="center" jc="center" p="$4" space="$4">
        <Stack.Screen options={{ title: "Keranjang" }} />
        <Feather name="shopping-cart" size={64} color="$gray10" />
        <H1>Keranjang Kosong</H1>
        <Paragraph textAlign="center" color="$gray11">
          Anda belum menambahkan produk apapun ke keranjang.
        </Paragraph>
        <Link href="/(tabs)/toko" asChild>
          <Button theme="blue" iconAfter={<Feather name="arrow-right" />}>
            Mulai Belanja
          </Button>
        </Link>
      </YStack>
    );
  }

  // Tampilan keranjang jika ada item
  return (
    <ScrollView f={1} bg="$background" contentContainerStyle={{ flexGrow: 1 }}>
      <Stack.Screen options={{ title: "Keranjang Saya" }} />
      <YStack p="$4" space="$4" f={1}>
        <H1>Keranjang Saya</H1>
        {userOrder.items.map((item) => {
          const localPlaceholder = "/images/icon2.png";
          let finalImageUri = localPlaceholder;

          if (item.product.image) {
            if (
              item.product.image.startsWith("http://") ||
              item.product.image.startsWith("https://")
            ) {
              finalImageUri = item.product.image;
            } else if (item.product.image.startsWith("/")) {
              finalImageUri = item.product.image;
            }
          }

          return (
            <View
              key={item.id}
              p="$3"
              borderRadius="$4"
              bg="$color2"
              space="$3"
            >
              <XStack space="$3" ai="center">
                <Image
                  source={{
                    uri: finalImageUri,
                  }}
                  width={80}
                  height={80}
                  borderRadius="$2"
                />
                <YStack f={1} space="$1">
                  <Text fontSize="$6" fontWeight="bold" numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <Text fontSize="$4" color="$gray11">
                    Rp {item.price.toLocaleString("id-ID")}
                  </Text>
                </YStack>
              </XStack>
              <XStack ai="center" jc="space-between" mt="$3">
                <XStack ai="center" space="$2">
                  <Button
                    size="$3"
                    circular
                    icon={<Feather name="minus" />}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  />
                  <Text fontSize="$5" mx="$2" fontWeight="bold">
                    {item.quantity}
                  </Text>
                  <Button
                    size="$3"
                    circular
                    icon={<Feather name="plus" />}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  />
                </XStack>
                <YStack ai="flex-end">
                  <Text fontSize="$3" color="$gray10">
                    Subtotal
                  </Text>
                  <Text fontSize="$5" fontWeight="bold">
                    Rp {item.subtotal.toLocaleString("id-ID")}
                  </Text>
                </YStack>
              </XStack>
              <Button
                variant="outlined"
                borderColor="$red7"
                color="$red10"
                icon={<Feather name="trash-2" size={16} />}
                onPress={() => removeItem(item.id)}
                mt="$3"
                size="$3"
              >
                Hapus
              </Button>
              <Separator marginVertical="$3" />
            </View>
          );
        })}

        <YStack space="$2" mt="$4" p="$3" borderRadius="$4" bg="$color3">
          <XStack jc="space-between">
            <Text fontSize="$6">Total Pesanan:</Text>
            <Text fontSize="$7" fontWeight="bold">
              Rp {userOrder.totalAmount.toLocaleString("id-ID")}
            </Text>
          </XStack>
          <Button
            theme="green"
            size="$5"
            iconAfter={<Feather name="arrow-right" />}
            onPress={() => {
              if (userOrder && userOrder.id) {
                router.push({
                  pathname: "/checkout",
                  params: { orderId: userOrder.id },
                });
              } else {
                Alert.alert("Error", "Tidak ada pesanan yang dapat diproses.");
              }
            }}
          >
            Lanjut ke Pembayaran
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
