import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  YStack,
  XStack,
  Card,
  ScrollView,
  Paragraph,
  Button, // Ditambahkan Button
} from "tamagui";
import { useState, useEffect, useCallback, useRef } from "react"; // Ditambahkan useCallback
import { useAuth } from "@/hooks/useAuth";
import jsonData from "@/data/data.json";
import { Alert } from "react-native"; // Ditambahkan Alert
import { useIsFocused } from "@react-navigation/native"; // Ditambahkan useIsFocused

// Define interfaces based on data.json structure
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
}

interface OrderItemDetail {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItemDetail[];
  totalAmount: number;
  status:
    | "pending"
    | "processing"
    | "completed"
    | "cancelled"
    | "dikirim"
    | "selesai"
    | "sedang diproses"
    | "pesanan sampai";
  payment: any;
  createdAt: string;
  updatedAt: string;
  timerId?: number; // Diubah ke number
}

export default function OrdersScreen() {
  const { token } = useAuth();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  // Map untuk menyimpan timer ID aktif berdasarkan orderId, dikelola di luar state React
  // untuk menghindari re-render yang tidak perlu saat hanya timerId berubah.
  const activeTimers = useRef<Map<string, number>>(new Map()).current;

  const getUserIdFromToken = (authToken: string | null): string | null => {
    if (!authToken) return null;
    const userIdMatch = authToken.match(/usr-\d+/);
    return userIdMatch && userIdMatch[0] ? userIdMatch[0] : null;
  };

  const updateOrderStatus = useCallback(
    (orderId: string, newStatus: Order["status"]) => {
      // Hapus timer yang mungkin aktif untuk order ini dari Map dan jsonData
      if (activeTimers.has(orderId)) {
        clearTimeout(activeTimers.get(orderId)!);
        activeTimers.delete(orderId);
      }
      const orderInJsonIndex = (jsonData.orders as Order[]).findIndex(
        (o) => o.id === orderId
      );
      if (
        orderInJsonIndex !== -1 &&
        (jsonData.orders as Order[])[orderInJsonIndex].timerId
      ) {
        clearTimeout((jsonData.orders as Order[])[orderInJsonIndex].timerId!);
        delete (jsonData.orders as Order[])[orderInJsonIndex].timerId;
      }

      // Update status di jsonData
      if (orderInJsonIndex !== -1) {
        (jsonData.orders as Order[])[orderInJsonIndex].status = newStatus;
        (jsonData.orders as Order[])[orderInJsonIndex].updatedAt =
          new Date().toISOString();
      }

      // Update state React
      setUserOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                timerId: undefined,
              }
            : o
        )
      );
    },
    [activeTimers]
  );

  const cancelOrder = useCallback(
    (orderId: string) => {
      Alert.alert(
        "Batalkan Pesanan",
        "Apakah Anda yakin ingin membatalkan pesanan ini?",
        [
          { text: "Tidak", style: "cancel" },
          {
            text: "Ya, Batalkan",
            onPress: () => updateOrderStatus(orderId, "cancelled"),
            style: "destructive",
          },
        ]
      );
    },
    [updateOrderStatus]
  );

  const confirmReceipt = useCallback(
    (orderId: string) => {
      updateOrderStatus(orderId, "selesai");
      Alert.alert(
        "Pesanan Diterima",
        "Terima kasih telah mengkonfirmasi penerimaan pesanan Anda."
      );
    },
    [updateOrderStatus]
  );

  useEffect(() => {
    if (isFocused) {
      const userId = getUserIdFromToken(token);
      let ordersForUser: Order[] = [];
      if (userId) {
        ordersForUser = (jsonData.orders as Order[])
          .filter((order) => order.userId === userId)
          .map((o) => ({ ...o, timerId: activeTimers.get(o.id) || o.timerId })); // Ambil timerId dari activeTimers jika ada
      }
      setUserOrders(ordersForUser);
      setIsLoading(false);
    }
  }, [token, isFocused, activeTimers]); // activeTimers ditambahkan jika ingin merefleksikan perubahan timer di state

  useEffect(() => {
    userOrders.forEach((order) => {
      // Hapus timer lama jika ada dan tidak lagi relevan dengan status saat ini
      if (activeTimers.has(order.id)) {
        if (
          (order.status !== "sedang diproses" && order.status !== "dikirim") || // Status tidak lagi memerlukan timer
          (order.status === "sedang diproses" &&
            activeTimers.get(order.id) !== undefined &&
            order.timerId === undefined) || // Timer sudah di-clear dari state tapi masih di map
          (order.status === "dikirim" &&
            activeTimers.get(order.id) !== undefined &&
            order.timerId === undefined)
        ) {
          clearTimeout(activeTimers.get(order.id)!);
          activeTimers.delete(order.id);
        }
      }

      let newTimerId: number | undefined = undefined;

      if (order.status === "sedang diproses" && !activeTimers.has(order.id)) {
        newTimerId = setTimeout(() => {
          updateOrderStatus(order.id, "dikirim");
          activeTimers.delete(order.id); // Hapus dari map setelah selesai
        }, 5000) as unknown as number; // 5 detik
      } else if (order.status === "dikirim" && !activeTimers.has(order.id)) {
        newTimerId = setTimeout(() => {
          updateOrderStatus(order.id, "pesanan sampai");
          activeTimers.delete(order.id); // Hapus dari map setelah selesai
        }, 10000) as unknown as number; // 10 detik
      }

      if (newTimerId !== undefined) {
        activeTimers.set(order.id, newTimerId);
        // Simpan juga di jsonData untuk persistensi sederhana jika diperlukan saat reload/fokus
        const orderInJsonIndex = (jsonData.orders as Order[]).findIndex(
          (o) => o.id === order.id
        );
        if (orderInJsonIndex !== -1) {
          (jsonData.orders as Order[])[orderInJsonIndex].timerId = newTimerId;
        }
      }
    });

    // Cleanup timers saat komponen unmount
    return () => {
      activeTimers.forEach((timerId) => clearTimeout(timerId));
      activeTimers.clear();
      // Bersihkan juga dari jsonData saat unmount
      (jsonData.orders as Order[]).forEach((order) => {
        if (order.timerId) {
          clearTimeout(order.timerId);
          delete order.timerId;
        }
      });
    };
  }, [userOrders, updateOrderStatus, activeTimers]);

  if (isLoading) {
    return (
      <View f={1} jc="center" ai="center" bg="$background">
        <Text>Memuat pesanan...</Text>
      </View>
    );
  }

  if (userOrders.length === 0) {
    return (
      <YStack f={1} ai="center" jc="center" p="$4" space="$4" bg="$background">
        <Feather name="package" size={64} color="$gray10" />
        <Text fontSize="$7" fontWeight="700">
          Belum Ada Pesanan
        </Text>
        <Paragraph textAlign="center" color="$gray11">
          Anda belum melakukan pesanan apapun. Silakan lihat produk kami di
          toko.
        </Paragraph>
      </YStack>
    );
  }

  return (
    <ScrollView f={1} p="$4" bg="$background">
      <Text fontSize="$7" fontWeight="700" mb="$4">
        Pesanan Saya
      </Text>

      <YStack gap="$4">
        {userOrders.map((order) => (
          <OrderItemCard
            key={order.id}
            order={order}
            onCancelOrder={cancelOrder}
            onConfirmReceipt={confirmReceipt}
          />
        ))}
      </YStack>
    </ScrollView>
  );
}

interface OrderItemCardProps {
  order: Order;
  onCancelOrder: (orderId: string) => void;
  onConfirmReceipt: (orderId: string) => void;
}

function OrderItemCard({
  order,
  onCancelOrder,
  onConfirmReceipt,
}: OrderItemCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const productDisplay =
    order.items.length > 0
      ? order.items[0].product.name +
        (order.items.length > 1 ? ` dan ${order.items.length - 1} lainnya` : "")
      : "Tidak ada item";

  return (
    <Card bordered p="$4" gap="$3" elevate>
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontWeight="600" flex={1} numberOfLines={2} ellipsizeMode="tail">
          {productDisplay}
        </Text>
        <Feather name="box" size={20} color="#001F54" />
      </XStack>

      <Text color="$gray10">Tanggal Pesan: {formatDate(order.createdAt)}</Text>
      <Text color="$gray10">
        Total: Rp {order.totalAmount.toLocaleString("id-ID")}
      </Text>

      <XStack justifyContent="space-between" alignItems="center">
        <Text color="$gray10">ID: #{order.id.substring(0, 8)}...</Text>
        <Text fontWeight="600" color={getStatusColor(order.status)}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Text>
      </XStack>

      {(order.status === "pending" || order.status === "sedang diproses") && (
        <Button
          theme="red"
          onPress={() => onCancelOrder(order.id)}
          icon={<Feather name="x-circle" />}
          mt="$2"
        >
          Batalkan Pesanan
        </Button>
      )}

      {order.status === "pesanan sampai" && (
        <Button
          theme="green"
          onPress={() => onConfirmReceipt(order.id)}
          icon={<Feather name="check-circle" />}
          mt="$2"
        >
          Terima Pesanan
        </Button>
      )}
    </Card>
  );
}

function getStatusColor(status: Order["status"]) {
  switch (status.toLowerCase()) {
    case "selesai":
    case "completed":
      return "$green10";
    case "dikirim":
    case "processing":
      return "$orange10";
    case "sedang diproses":
    case "pending":
      return "$blue10";
    case "pesanan sampai":
      return "$purple10";
    case "cancelled":
      return "$red10";
    default:
      return "$gray10";
  }
}
