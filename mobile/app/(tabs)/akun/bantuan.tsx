import { Stack, useRouter } from "expo-router";
import {
  Button,
  Text,
  YStack,
  ScrollView,
  H4,
  Paragraph,
  Separator,
} from "tamagui";
import { Feather } from "@expo/vector-icons";

// Contoh data FAQ (Anda bisa memindahkannya ke file JSON atau mengambil dari API)
const faqs = [
  {
    question: "Bagaimana cara memesan air galon?",
    answer:
      "Anda dapat memesan air galon melalui tab 'Toko', pilih produk yang diinginkan, masukkan ke keranjang, lalu lanjutkan ke proses checkout.",
  },
  {
    question: "Bagaimana cara melihat riwayat pesanan saya?",
    answer:
      "Riwayat pesanan Anda dapat dilihat pada tab 'Pesanan'. Di sana akan tercantum semua pesanan yang pernah Anda buat.",
  },
  {
    question: "Bagaimana cara mengubah profil saya?",
    answer:
      "Anda dapat mengubah informasi profil Anda melalui tab 'Akun', lalu pilih menu 'Profil'.",
  },
  {
    question: "Apakah aplikasi ini aman?",
    answer:
      "Kami berkomitmen untuk menjaga keamanan data Anda. Informasi lebih lanjut dapat dilihat pada Kebijakan Privasi kami.",
  },
];

export default function BantuanScreen() {
  const router = useRouter();

  return (
    <ScrollView bg="$background" f={1}>
      <YStack p="$4" space="$4">
        <Stack.Screen
          options={{
            title: "Bantuan & Dukungan", // Judul header diubah
            headerLeft: () => (
              <Button
                icon={<Feather name="chevron-left" size={24} />}
                onPress={() => router.back()}
                chromeless
                paddingLeft={0}
              />
            ),
          }}
        />
        <H4 ta="center" mb="$2">
          Pusat Bantuan
        </H4>

        <YStack space="$3" p="$3" borderRadius="$4" bg="$backgroundFocus">
          <Text fontSize="$6" fontWeight="600">
            Pertanyaan yang Sering Diajukan (FAQ)
          </Text>
          <Separator />
          {faqs.map((faq, index) => (
            <YStack key={index} space="$2" mt="$2">
              <Text fontWeight="bold">{faq.question}</Text>
              <Paragraph>{faq.answer}</Paragraph>
              {index < faqs.length - 1 && <Separator marginVertical="$2" />}
            </YStack>
          ))}
        </YStack>

        <YStack
          space="$3"
          p="$3"
          borderRadius="$4"
          bg="$backgroundFocus"
          mt="$4"
        >
          <Text fontSize="$6" fontWeight="600">
            Hubungi Kami
          </Text>
          <Separator />
          <Paragraph mt="$2">
            Jika Anda memiliki pertanyaan lebih lanjut atau membutuhkan bantuan,
            jangan ragu untuk menghubungi tim dukungan kami melalui:
          </Paragraph>
          <Text>
            Email: <Text fontWeight="bold">dukungan@depotair.com</Text>
          </Text>
          <Text>
            Telepon: <Text fontWeight="bold">(021) 123-4567</Text>
          </Text>
          {/* Anda bisa menambahkan link ke media sosial atau form kontak di sini */}
        </YStack>

        <YStack
          space="$3"
          p="$3"
          borderRadius="$4"
          bg="$backgroundFocus"
          mt="$4"
        >
          <Text fontSize="$6" fontWeight="600">
            Tautan Penting
          </Text>
          <Separator />
          <Button
            chromeless
            onPress={() => console.log("Navigasi ke Syarat & Ketentuan")}
          >
            <Text color="$blue10">Syarat & Ketentuan</Text>
          </Button>
          <Button
            chromeless
            onPress={() => console.log("Navigasi ke Kebijakan Privasi")}
          >
            <Text color="$blue10">Kebijakan Privasi</Text>
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
