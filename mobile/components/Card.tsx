import { Button, Card, CardProps, H2, Image, Paragraph, XStack } from "tamagui";

export function ProdukCard(props: CardProps) {
  return (
    <Card elevate size="$4" bordered {...props}>
      <Card.Header padded>
        <H2>Sony A7IV</H2>
        <Paragraph theme="alt2">Now available</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button borderRadius="$10">Purchase</Button>
      </Card.Footer>
      <Card.Background>
        <Image
          resizeMode="contain"
          alignSelf="center"
          source={require("@/assets/images/home/hero.png")}
        />
      </Card.Background>
    </Card>
  );
}
