import { View, Text, XStack, YStack, Button, Image, ScrollView } from "tamagui";
import { Link } from "expo-router";

export default function Produk() {
  return (
    <YStack f={1} bg="$background" p="$4">
      {/* Header */}
      <Text fontSize="$8" fontWeight="700" mb="$4">
        Produk
      </Text>

      {/* Banner */}
      <View
        bg="$blue4"
        p="$4"
        borderRadius="$4"
        mb="$4"
        ai="center"
        jc="center"
      >
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2917/2917991.png",
          }}
          width={100}
          height={100}
          resizeMode="contain"
        />
        <Text fontSize="$6" fontWeight="700" mt="$2">
          Air Isi Ulang
        </Text>
        <Text fontSize="$3" color="$gray11" textAlign="center">
          Air minum berkualitas isi ulang
        </Text>
      </View>

      {/* List Produk */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {Array.from({ length: 5 }).map((_, index) => (
          <XStack
            key={index}
            bg="$color1"
            borderRadius="$4"
            p="$3"
            mb="$3"
            ai="center"
            jc="space-between"
          >
            <XStack ai="center">
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/2917/2917991.png",
                }}
                width={50}
                height={50}
                borderRadius={8}
              />
              <YStack ml="$3">
                <Text fontSize="$5" fontWeight="600">
                  Air Isi Ulang
                </Text>
                <Text fontSize="$3" color="$gray11">
                  Rp 5.000
                </Text>
              </YStack>
            </XStack>

            <Button size="$3" theme="blue">
              Tambah
            </Button>
          </XStack>
        ))}
      </ScrollView>
    </YStack>
  );
}
