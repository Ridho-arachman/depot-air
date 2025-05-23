import {
  View,
  Text,
  YStack,
  XStack,
  Button,
  ScrollView,
  Spinner,
  H3,
  Paragraph,
  Separator,
  Card,
} from "tamagui";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import json from "@/data/data.json"; // Pastikan path ini benar
import { Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth"; // Untuk mendapatkan userId jika diperlukan

// --- Definisi Tipe Data (Idealnya diimpor dari file types terpusat) ---
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
  price: number;
  subtotal: number;
}

interface PaymentDetails {
  id: string;
  orderId: string;
  amount: number;
  method: string; // Contoh: 'virtual_account', 'credit_card'
  status: string; // Contoh: 'pending', 'paid', 'failed'
  createdAt: string;
  updatedAt: string;
  paymentUrl?: string; // Jika ada URL pembayaran eksternal
  paymentToken?: string; // Jika ada token pembayaran
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status:
    | "pending"
    | "processing"
    | "completed"
    | "cancelled"
    | "dikirim"
    | "selesai"
    | "sedang diproses";
  payment: PaymentDetails | null;
  createdAt: string;
  updatedAt: string;
}
// --- Akhir Definisi Tipe Data ---

export default function CheckoutScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const router = useRouter();
  const { token } = useAuth(); // Untuk validasi pengguna jika diperlukan

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const getUserIdFromToken = (authToken: string | null): string | null => {
    if (!authToken) return null;
    const userIdMatch = authToken.match(/usr-\d+/);
    return userIdMatch && userIdMatch[0] ? userIdMatch[0] : null;
  };

  useEffect(() => {
    if (orderId) {
      const userId = getUserIdFromToken(token);
      const foundOrder = (json.orders as Order[]).find(
        (o) => o.id === orderId && (userId ? o.userId === userId : true) // Validasi userId jika ada token
      );

      if (foundOrder) {
        setCurrentOrder(foundOrder);
      } else {
        Alert.alert("Error", "Pesanan tidak ditemukan atau tidak valid.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } else {
      Alert.alert("Error", "ID Pesanan tidak ditemukan.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
    setIsLoading(false);
  }, [orderId, token, router]);

  const handleSimulatePayment = () => {
    if (!currentOrder) return;

    setIsProcessingPayment(true);

    // Simulasi proses pembayaran
    setTimeout(() => {
      const orderIndex = (json.orders as Order[]).findIndex(
        (o) => o.id === currentOrder.id
      );
      if (orderIndex !== -1) {
        const updatedOrder: Order = {
          ...currentOrder,
          status: "sedang diproses", // Atau "completed" jika langsung selesai
          payment: {
            id: `pay-${Date.now()}`,
            orderId: currentOrder.id,
            amount: currentOrder.totalAmount,
            method: "Simulasi Pembayaran",
            status: "paid",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };
        (json.orders as Order[])[orderIndex] = updatedOrder;
        setCurrentOrder(updatedOrder); // Update state lokal

        // --- TAMBAHAN: Logika untuk mereset keranjang --- 
        const userId = getUserIdFromToken(token);
        if (userId) {
          // Cari order 'pending' lain milik user ini (yang merupakan keranjang aktif sebelumnya)
          // Dalam skenario ini, order yang baru saja di-checkout adalah currentOrder,
          // dan itu sudah diubah statusnya dari 'pending'.
          // Jika ada order 'pending' lain (seharusnya tidak jika alurnya benar, 
          // karena checkout dilakukan dari keranjang/order 'pending' yang aktif),
          // kita bisa mempertimbangkan untuk menghapusnya atau mengubah statusnya.
          // Namun, karena currentOrder adalah order 'pending' yang di-checkout,
          // dan statusnya sudah diubah, maka keranjang.tsx seharusnya sudah tidak menampilkannya lagi.

          // Untuk memastikan keranjang benar-benar kosong jika ada kasus aneh,
          // kita bisa mencari order 'pending' milik user dan menghapusnya atau mengosongkan items-nya.
          // Namun, pendekatan yang lebih bersih adalah memastikan bahwa setelah checkout,
          // order yang di-checkout (currentOrder) tidak lagi berstatus 'pending'.
          // Halaman keranjang.tsx hanya mengambil order dengan status 'pending'.
          // Jadi, dengan mengubah status currentOrder, keranjang akan otomatis kosong.

          // Jika Anda ingin secara eksplisit menghapus order 'pending' yang mungkin masih ada (meskipun seharusnya tidak):
          // const pendingCartOrderIndex = (json.orders as Order[]).findIndex(
          //  (o) => o.userId === userId && o.status === "pending" && o.id !== currentOrder.id // Pastikan bukan order yang baru di-checkout
          // ); 
          // if (pendingCartOrderIndex !== -1) {
          //  (json.orders as Order[]).splice(pendingCartOrderIndex, 1); 
          //  console.log('Keranjang (order pending sisa) telah dihapus setelah checkout.');
          // }
        }
        // --- AKHIR TAMBAHAN --- 

        Alert.alert(
          "Pembayaran Berhasil (Simulasi)",
          "Pesanan Anda sedang diproses.",
          [
            {
              text: "Lihat Pesanan",
              onPress: () => router.replace("/(tabs)/pesanan"),
            },
            {
              text: "Kembali ke Toko",
              onPress: () => router.replace("/(tabs)/toko"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Error",
          "Gagal memproses pembayaran, pesanan tidak ditemukan."
        );
      }
      setIsProcessingPayment(false);
    }, 2000); // Simulasi delay 2 detik
  };

  if (isLoading) {
    return (
      <View f={1} jc="center" ai="center" p="$4" bg="$background">
        <Stack.Screen options={{ title: "Memuat Checkout..." }} />
        <Spinner size="large" color="$blue10" />
        <Text mt="$2">Memuat detail pesanan...</Text>
      </View>
    );
  }

  if (!currentOrder) {
    return (
      <View f={1} jc="center" ai="center" p="$4" bg="$background">
        <Stack.Screen options={{ title: "Error" }} />
        <Feather name="alert-circle" size={48} color="$red10" />
        <Text fontSize="$6" mt="$2" ta="center">
          Pesanan tidak dapat ditemukan.
        </Text>
        <Button
          mt="$4"
          onPress={() => router.back()}
          icon={<Feather name="arrow-left" />}
        >
          Kembali
        </Button>
      </View>
    );
  }

  if (currentOrder.status !== "pending") {
    return (
      <View f={1} jc="center" ai="center" p="$4" bg="$background">
        <Stack.Screen options={{ title: "Status Pesanan" }} />
        <Feather
          name={
            currentOrder.status === "completed" ||
            currentOrder.status === "selesai" ||
            currentOrder.status === "dikirim" ||
            currentOrder.status === "sedang diproses"
              ? "check-circle"
              : "info"
          }
          size={48}
          color={
            currentOrder.status === "completed" ||
            currentOrder.status === "selesai"
              ? "$green10"
              : "$blue10"
          }
        />
        <Text fontSize="$6" mt="$3" ta="center" fontWeight="bold">
          Pesanan #{currentOrder.id.substring(0, 8)}
        </Text>
        <Text fontSize="$5" mt="$2" ta="center">
          Status:{" "}
          <Text
            fontWeight="bold"
            color={
              currentOrder.status === "completed" ||
              currentOrder.status === "selesai"
                ? "$green10"
                : "$blue10"
            }
          >
            {currentOrder.status.toUpperCase()}
          </Text>
        </Text>
        <Paragraph ta="center" mt="$2" color="$gray11">
          Pesanan ini sudah diproses atau statusnya tidak lagi 'pending'. Anda
          dapat melihat detailnya di halaman Pesanan Saya.
        </Paragraph>
        <Button
          mt="$4"
          onPress={() => router.replace("/(tabs)/pesanan")}
          iconAfter={<Feather name="arrow-right" />}
        >
          Lihat Pesanan Saya
        </Button>
      </View>
    );
  }

  return (
    <ScrollView bg="$background" f={1}>
      <Stack.Screen options={{ title: "Konfirmasi Pesanan" }} />
      <YStack p="$4" space="$4">
        <H3 ta="center">Rincian Pesanan</H3>
        <Card elevate p="$4" space="$3">
          <Text fontSize="$3" color="$gray10">
            Order ID: {currentOrder.id}
          </Text>
          <Separator />
          {currentOrder.items.map((item) => (
            <XStack key={item.id} jc="space-between" ai="center" space="$3">
              <YStack f={1}>
                <Text fontWeight="bold" numberOfLines={1}>
                  {item.product.name}
                </Text>
                <Text fontSize="$3" color="$gray10">
                  {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                </Text>
              </YStack>
              <Text fontWeight="bold">
                Rp {item.subtotal.toLocaleString("id-ID")}
              </Text>
            </XStack>
          ))}
          <Separator />
          <XStack jc="space-between" ai="center">
            <Text fontSize="$5" fontWeight="bold">
              Total Pembayaran:
            </Text>
            <Text fontSize="$6" fontWeight="bold" color="$blue10">
              Rp {currentOrder.totalAmount.toLocaleString("id-ID")}
            </Text>
          </XStack>
        </Card>

        <Card elevate p="$4" space="$3">
          <H3 ta="center" mb="$2">
            Alamat Pengiriman
          </H3>
          {/* Anda perlu mengambil alamat pengguna dari data.json atau state */}
          <Paragraph color="$gray11">
            {json.users.find((u) => u.id === currentOrder.userId)?.address ||
              "Alamat tidak tersedia"}
          </Paragraph>
          <Paragraph color="$gray11" fontSize="$2">
            Pastikan alamat Anda sudah benar sebelum melanjutkan.
          </Paragraph>
        </Card>

        <Card elevate p="$4" space="$3">
          <H3 ta="center" mb="$2">
            Metode Pembayaran
          </H3>
          <Paragraph color="$gray11" ta="center">
            Saat ini kami hanya mendukung "Simulasi Pembayaran".
          </Paragraph>
          {/* Di sini Anda bisa menambahkan pilihan metode pembayaran jika ada */}
        </Card>

        <Button
          theme="green"
          size="$5"
          icon={
            isProcessingPayment ? (
              <Spinner color="$color" />
            ) : (
              <Feather name="credit-card" />
            )
          }
          onPress={handleSimulatePayment}
          disabled={isProcessingPayment || currentOrder.status !== "pending"}
        >
          {isProcessingPayment ? "Memproses..." : "Bayar Sekarang"}
        </Button>
        {currentOrder.status !== "pending" && (
          <Text fontSize="$2" ta="center" col="$orange10" mt="$2">
            Pesanan ini sudah tidak dapat dibayar lagi (status:{" "}
            {currentOrder.status}).
          </Text>
        )}
      </YStack>
    </ScrollView>
  );
}
