import {
  H1,
  H2,
  ScrollView,
  YStack,
  XStack,
  Text,
  Button,
  Image,
  Card,
  Paragraph,
} from "tamagui";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useRouter } from "expo-router";
import { homeAssets } from "@/constants/homeAssets";
import { useColorScheme } from "react-native";
import { ProdukCard } from "@/components/Card";

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const pressHandle = () => {
    router.push("/produk");
  };

  return (
    <ScrollView mx="$5" my="$6">
      {/* HEADING */}
      <XStack justifyContent="space-between">
        <YStack>
          <H1 fontSize="$10" lineHeight="$10" fontWeight="bold" color="$blue11">
            RIDHO FRESH
          </H1>
          <Text fontSize={"$4"}>Depot Air Isi Ulang</Text>
        </YStack>
        <Button
          onPress={pressHandle}
          backgroundColor={colorScheme === "dark" ? "white" : "$blue5"}
        >
          <SimpleLineIcons name="basket" size={24} color="black" />
        </Button>
      </XStack>

      {/* HERO */}
      <XStack
        backgroundColor="$blue5"
        padding="$4"
        alignItems="center"
        mt="$6"
        borderRadius="$6"
      >
        <YStack flex={1} maxWidth="77%" paddingRight="$3" gap="$2">
          <Text color="$blue11" fontSize="$6" fontWeight="bold">
            Selamat datang di Ridho Fresh!
          </Text>
          <Text>Pesan Air Isi Ulang Dengan Mudah</Text>
        </YStack>
        <YStack flex={1} maxWidth="23%" alignItems="center">
          <Image
            source={homeAssets.hero}
            width={150}
            height={150}
            resizeMode="contain"
          />
        </YStack>
      </XStack>

      {/* JASA */}
      <YStack mt="$6">
        <H2 fontSize="$9" fontWeight="bold">
          Jasa
        </H2>
        <XStack justifyContent="center" gap={"$4"} flexWrap="wrap">
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
              <H2 color="$blue6" fontSize={"$8"} fontWeight="bold">
                Galon 19 L
              </H2>
              <Text color="black">RP. 5.000</Text>
            </Card.Header>

            <Card.Footer padded>
              <XStack flex={1} />
              <Button borderRadius="$10">Purchase</Button>
            </Card.Footer>

            <Card.Background>
              <Image
                resizeMode="cover"
                width="100%"
                height="100%"
                source={homeAssets.jasa1}
              />
            </Card.Background>
          </Card>
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
              <H2 color="$blue6" fontSize={"$8"} fontWeight="bold">
                Galon 19 L
              </H2>
              <Text color="black">RP. 5.000</Text>
            </Card.Header>

            <Card.Footer padded>
              <XStack flex={1} />
              <Button borderRadius="$10">Purchase</Button>
            </Card.Footer>

            <Card.Background>
              <Image
                resizeMode="cover"
                width="100%"
                height="100%"
                source={homeAssets.jasa2}
              />
            </Card.Background>
          </Card>
        </XStack>
      </YStack>
    </ScrollView>
  );
}
