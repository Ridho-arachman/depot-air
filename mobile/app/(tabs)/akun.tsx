import { Feather } from "@expo/vector-icons";
import { View, Text, YStack, Button, XStack, Avatar } from "tamagui";

export default function AccountScreen() {
  return (
    <YStack f={1} padding="$4" backgroundColor="$background">
      {/* Header */}
      <YStack ai="center" gap="$2" mb="$6">
        <Avatar circular size="$10">
          <Avatar.Image src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
          <Avatar.Fallback bc="gray" />
        </Avatar>
        <Text fontSize="$7" fontWeight="600">
          Bapak Ridho
        </Text>
        <Text color="$gray10">0812 3456 7890</Text>
      </YStack>

      {/* Menu */}
      <YStack gap="$3">
        <MenuItem icon="user" label="Profil" onPress={() => {}} />
        <MenuItem icon="settings" label="Pengaturan" onPress={() => {}} />
        <MenuItem icon="help-circle" label="Bantuan" onPress={() => {}} />
        <MenuItem icon="power" label="Keluar" onPress={() => {}} />
      </YStack>
    </YStack>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Button
      onPress={onPress}
      backgroundColor="white"
      justifyContent="space-between"
      borderRadius="$4"
      size="$5"
      icon={<Feather name={icon} size={20} color="#001F54" />}
    >
      <XStack ai="center" space="$3">
        <Feather name={icon} size={20} color="#001F54" />
        <Text color="#001F54" fontSize="$5">
          {label}
        </Text>
      </XStack>
    </Button>
  );
}
