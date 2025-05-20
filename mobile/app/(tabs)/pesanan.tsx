import { Feather } from "@expo/vector-icons";
import { View, Text, YStack, XStack, Card, ScrollView, Spacer } from "tamagui";

export default function OrdersScreen() {
  const orders = [
    {
      id: "001",
      status: "Sedang diproses",
      product: "Galon 15 Liter",
      date: "28 April 2025",
    },
    {
      id: "002",
      status: "Dikirim",
      product: "Air isi ulang galon 19 Liter",
      date: "25 April 2025",
    },
    {
      id: "003",
      status: "Selesai",
      product: "Galon 15 Liter",
      date: "20 April 2025",
    },
  ];

  return (
    <ScrollView f={1} p="$4" bg="$background">
      <Text fontSize="$7" fontWeight="700" mb="$4">
        Pesanan Saya
      </Text>

      <YStack gap="$4">
        {orders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </YStack>
    </ScrollView>
  );
}

function OrderItem({
  order,
}: {
  order: { id: string; status: string; product: string; date: string };
}) {
  return (
    <Card bordered p="$4" gap="$3" elevate>
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontWeight="600">{order.product}</Text>
        <Feather name="box" size={20} color="#001F54" />
      </XStack>

      <Text color="$gray10">{order.date}</Text>

      <XStack justifyContent="space-between" alignItems="center">
        <Text color="$gray10">ID: #{order.id}</Text>
        <Text fontWeight="600" color={getStatusColor(order.status)}>
          {order.status}
        </Text>
      </XStack>
    </Card>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "Selesai":
      return "green";
    case "Dikirim":
      return "orange";
    case "Sedang diproses":
      return "blue";
    default:
      return "$gray10";
  }
}
