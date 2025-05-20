import { ServiceCardProps } from "@/components/types/home";
import { Card, H2, Text, XStack, Button, Image } from "tamagui";

export function ServiceCard({ title, price, image }: ServiceCardProps) {
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
        <Button borderRadius="$10">Pesan</Button>
      </Card.Footer>

      <Card.Background>
        <Image resizeMode="cover" width="100%" height="100%" source={image} />
      </Card.Background>
    </Card>
  );
}
