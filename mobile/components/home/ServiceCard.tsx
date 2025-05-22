import { ServiceCardProps } from "@/components/types/home";
import { Card, H2, Text, XStack, Button, Image } from "tamagui";
import { Link } from "expo-router"; // Impor Link

// Pastikan ServiceCardProps di "@/components/types/home" juga memiliki 'id: string;'
export function ServiceCard({ title, price, image, id }: ServiceCardProps & { id: string }) { // Tambahkan 'id' ke props
  return (
    <Card
      elevate
      size="$4"
      animation="bouncy"
      width="45%"
      height={200}
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      borderRadius="$4"
      overflow="hidden"
    >
      <Card.Header padded>
        <H2 color="$blue4" fontSize="$8" lineHeight="$5" fontWeight="bold">
          {title}
        </H2>
        <Text color="black">{price}</Text>
      </Card.Header>

      <Card.Footer padded>
        <XStack flex={1} />
        <Link
          href={{
            pathname: "/produk/[id]", // Path ke halaman detail produk
            params: { id: id },       // Kirim 'id' produk sebagai parameter
          }}
          asChild // Agar Link menggunakan Button sebagai child-nya untuk styling dan event
        >
          <Button borderRadius="$10">Pesan</Button>
        </Link>
      </Card.Footer>

      <Card.Background>
        <Image resizeMode="cover" width="100%" height="100%" source={image} />
      </Card.Background>
    </Card>
  );
}
