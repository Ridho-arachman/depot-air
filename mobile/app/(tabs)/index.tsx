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
  View,
} from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useRouter } from "expo-router";
import { homeAssets } from "@/constants/homeAssets";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const pressHandle = () => {
    router.push("/produk");
  };

  return (
    <ScrollView pt="$6">
      <View mx="$4" mb="$15">
        {/* HEADING */}
        <XStack justifyContent="space-between">
          <YStack>
            <H1
              fontSize="$10"
              lineHeight="$10"
              fontWeight="bold"
              color="$blue11"
            >
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
        <LinearGradient
          colors={["$blue10", "$blue1"]}
          start={[0, 1]}
          end={[1, 0]}
          mt={"$4"}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          borderRadius={20}
        >
          <XStack
            backgroundColor="$colorTransparent"
            padding="$4"
            alignItems="center"
            borderRadius="$6"
            width="100%" // <<< tambah width
            alignSelf="center" // <<< supaya posisinya center
          >
            <YStack flex={1} maxWidth="77%" paddingRight="$3" gap="$2">
              <Text color="white" fontSize="$6" fontWeight="bold">
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
        </LinearGradient>

        {/* JASA */}
        <YStack mt="$6" gap={"$4"}>
          <H2 fontSize="$9" fontWeight="bold">
            Jasa
          </H2>
          <XStack
            justifyContent="flex-start"
            gap={"$4"}
            flexWrap="wrap"
            mx="auto"
          >
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
                <H2
                  color="$blue4"
                  fontSize="$8"
                  lineHeight="$5"
                  fontWeight="bold"
                >
                  Isi Ulang Galon 19 Liter
                </H2>
                <Text color="black">RP. 5.000</Text>
              </Card.Header>

              <Card.Footer padded>
                <XStack flex={1} />
                <Button borderRadius="$10">Pesan</Button>
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
                <H2
                  color="$blue4"
                  fontSize="$8"
                  lineHeight="$5"
                  fontWeight="bold"
                >
                  Isi Ulang Galon 19 Liter
                </H2>
                <Text color="black">RP. 5.000</Text>
              </Card.Header>

              <Card.Footer padded>
                <XStack flex={1} />
                <Button borderRadius="$10">Pesan</Button>
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
                <Button borderRadius="$10">Pesan</Button>
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

        {/* TENTANG */}
        <YStack mt="$6" gap={"$4"}>
          <H2 fontSize="$9" fontWeight="bold">
            Tentang
          </H2>
          <XStack
            gap={"$4"}
            maxWidth={"100%"}
            backgroundColor={"$gray6Light"}
            borderRadius={"$4"}
            justifyContent="center"
            alignContent="center"
            padding="$4"
            mx={"auto"}
          >
            <Feather
              name="info"
              size={100}
              color="blue"
              style={{ maxWidth: "300%" }}
            />
            <Paragraph color="$blue6" fontSize="$6" maxWidth={"60%"} mt={"$2"}>
              Depot air isi ulang Ridho Fresh menyediakan layanan pengisian air
              minum dengan kualitas terbaik
            </Paragraph>
          </XStack>
        </YStack>

        {/* LOKASI */}
        <YStack mt="$6" gap={"$4"}>
          <H2 fontSize="$9" fontWeight="bold">
            Tentang
          </H2>
          <XStack
            gap={"$4"}
            maxWidth={"100%"}
            backgroundColor={"$gray6Light"}
            borderRadius={"$4"}
            justifyContent="center"
            alignContent="center"
            padding="$4"
            mx={"auto"}
          >
            <Feather
              name="info"
              size={100}
              color="blue"
              style={{ maxWidth: "300%" }}
            />
            <Paragraph color="$blue6" fontSize="$6" maxWidth={"60%"} mt={"$2"}>
              Depot air isi ulang Ridho Fresh menyediakan layanan pengisian air
              minum dengan kualitas terbaik
            </Paragraph>
          </XStack>
        </YStack>
      </View>
    </ScrollView>
  );
}
