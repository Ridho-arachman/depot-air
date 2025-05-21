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

  const getUserIdFromToken = (authToken: string | null): string | null => {
    if (!authToken) return null;
    const userIdMatch = authToken.match(/usr-\d+/);
    return userIdMatch && userIdMatch[0] ? userIdMatch[0] : null;
  };

  useEffect(() => {
    const userId = getUserIdFromToken(token);
    if (userId) {
      const order = (json.orders as Order[]).find(
        // Cast json.orders to Order[]
        (o) => o.userId === userId && o.status === "pending"
      );
      setUserOrder(order || null);
    } else {
      setUserOrder(null); // Jika tidak ada user ID, tidak ada order
    }
    setIsLoading(false);
  }, [token, json.orders]); // Tambahkan json.orders sebagai dependency agar re-render jika order berubah

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

    // Cek apakah stok cukup untuk menambah kuantitas
    if (quantityDifference > 0 && productInCatalog.stock < quantityDifference) {
      Alert.alert(
        "Stok Tidak Cukup",
        `Hanya tersisa ${productInCatalog.stock} unit untuk ${productInCatalog.name}.`
      );
      return;
    }

    if (newQuantity <= 0) {
      // Jika kuantitas 0 atau kurang, hapus item
      removeItem(itemId);
      return;
    }

    const updatedItems = [...userOrder.items];
    updatedItems[itemIndex].quantity = newQuantity;
    updatedItems[itemIndex].subtotal =
      newQuantity * updatedItems[itemIndex].price;

    // Update stok di katalog utama
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

    // Update order di json.orders (simulasi)
    const orderInJsonIndex = (json.orders as Order[]).findIndex(
      (o) => o.id === userOrder.id
    ); // Cast json.orders
    if (orderInJsonIndex !== -1) {
      (json.orders as Order[])[orderInJsonIndex] = updatedOrder; // Cast json.orders
    }
    // Perbarui juga state produk di halaman toko jika perlu (misalnya melalui context atau event)
    // Untuk sekarang, kita asumsikan perubahan stok di json.products akan terbaca di halaman toko saat dibuka kembali
  };

  const removeItem = (itemId: string) => {
    if (!userOrder) return;

    const itemToRemove = userOrder.items.find((item) => item.id === itemId);
    if (!itemToRemove) return;

    const productInCatalog = json.products.find(
      (p) => p.id === itemToRemove.productId
    ) as Product | undefined;
    if (productInCatalog) {
      productInCatalog.stock += itemToRemove.quantity; // Kembalikan stok
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
      // Jika keranjang kosong, kita bisa hapus order pending atau biarkan kosong
      // Untuk simulasi ini, kita biarkan ordernya ada tapi items kosong
      setUserOrder(updatedOrder);
      const orderInJsonIndex = (json.orders as Order[]).findIndex(
        (o) => o.id === userOrder.id
      ); // Cast json.orders
      if (orderInJsonIndex !== -1) {
        (json.orders as Order[])[orderInJsonIndex] = updatedOrder; // Cast json.orders // atau hapus: json.orders.splice(orderInJsonIndex, 1);
      }
    } else {
      setUserOrder(updatedOrder);
      const orderInJsonIndex = (json.orders as Order[]).findIndex(
        (o) => o.id === userOrder.id
      ); // Cast json.orders
      if (orderInJsonIndex !== -1) {
        (json.orders as Order[])[orderInJsonIndex] = updatedOrder; // Cast json.orders
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

  return (
    <ScrollView f={1} bg="$background" contentContainerStyle={{ flexGrow: 1 }}>
      <Stack.Screen options={{ title: "Keranjang Saya" }} />
      <YStack p="$4" space="$4" f={1}>
        <H1>Keranjang Saya</H1>
        {userOrder.items.map((item) => (
          <View key={item.id} p="$3" borderRadius="$4" bg="$color2" space="$3">
            <XStack space="$3" ai="center">
              <Image
                source={{
                  uri: item.product.image || "https://via.placeholder.com/100",
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
                  disabled={item.quantity <= 1 && false} // This logic effectively means the button is never disabled here.
                />
                <Text fontSize="$5" mx="$2" fontWeight="bold"> {/* Changed marginInline to mx */}
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
        ))}

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
              // Navigasi ke halaman pembayaran atau checkout
              Alert.alert(
                "Checkout",
                "Fitur checkout belum diimplementasikan."
              );
              // router.push("/checkout"); // Contoh navigasi
            }}
          >
            Lanjut ke Pembayaran
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
