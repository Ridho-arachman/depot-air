import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { Platform, StyleSheet, useColorScheme } from "react-native";

const Layout = () => {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabs,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Entypo
              name="home"
              size={24}
              color={focused ? "#007AFF" : "#999"}
            />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabs: {
    backgroundColor: "#fff",
    height: Platform.OS === "ios" ? 88 : 64,
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
    paddingTop: Platform.OS === "ios" ? 20 : 7,
    marginHorizontal: "auto",
    width: "85%",
    marginBottom: 20,
    borderRadius: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default Layout;
