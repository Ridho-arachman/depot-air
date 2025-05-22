import { Feather } from "@expo/vector-icons";
import { View, Text, YStack, XStack, Card, ScrollView, Paragraph } from "tamagui"; // Removed Spacer, added Paragraph
import { useState, useEffect } from "react"; // Added useState, useEffect
import { useAuth } from "@/hooks/useAuth"; // Added useAuth
import jsonData from "@/data/data.json"; // Added data import

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
  status: "pending" | "processing" | "completed" | "cancelled" | "dikirim" | "selesai" | "sedang diproses"; // Adjusted status types
  payment: any; // Simplified for this example, consider defining Payment interface
  createdAt: string;
  updatedAt: string;
}

export default function OrdersScreen() {
  const { token } = useAuth();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserIdFromToken = (authToken: string | null): string | null => {
    if (!authToken) return null;
    const userIdMatch = authToken.match(/usr-\d+/);
    return userIdMatch && userIdMatch[0] ? userIdMatch[0] : null;
  };

  useEffect(() => {
    const userId = getUserIdFromToken(token);
    if (userId) {
      const ordersForUser = (jsonData.orders as Order[]).filter(
        (order) => order.userId === userId
      );
      setUserOrders(ordersForUser);
    } else {
      setUserOrders([]);
    }
    setIsLoading(false);
  }, [token]);

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
          Anda belum melakukan pesanan apapun. Silakan lihat produk kami di toko.
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
          <OrderItemCard key={order.id} order={order} />
        ))}
      </YStack>
    </ScrollView>
  );
}

function OrderItemCard({ order }: { order: Order }) { // Renamed to OrderItemCard and updated prop
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Displaying the name of the first product or a summary
  const productDisplay =
    order.items.length > 0
      ? order.items[0].product.name +
        (order.items.length > 1 ? ` dan ${order.items.length - 1} lainnya` : "")
      : "Tidak ada item";

  return (
    <Card bordered p="$4" gap="$3" elevate>
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontWeight="600" flex={1} numberOfLines={2} ellipsizeMode="tail">{productDisplay}</Text>
        <Feather name="box" size={20} color="#001F54" />
      </XStack>

      <Text color="$gray10">Tanggal Pesan: {formatDate(order.createdAt)}</Text>
      <Text color="$gray10">Total: Rp {order.totalAmount.toLocaleString("id-ID")}</Text>

      <XStack justifyContent="space-between" alignItems="center">
        <Text color="$gray10">ID: #{order.id.substring(0, 8)}...</Text>
        <Text fontWeight="600" color={getStatusColor(order.status)}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Text>
      </XStack>
    </Card>
  );
}

function getStatusColor(status: Order['status']) { // Updated status type
  switch (status.toLowerCase()) {
    case "selesai":
    case "completed":
      return "green";
    case "dikirim":
    case "processing": // Assuming processing might be like 'dikirim'
      return "orange";
    case "sedang diproses":
    case "pending":
      return "blue";
    case "cancelled":
      return "red";
    default:
      return "$gray10";
  }
}
