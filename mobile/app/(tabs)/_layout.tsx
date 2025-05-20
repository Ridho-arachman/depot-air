import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StyleSheet, useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";

const Layout = () => {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabs,
        tabBarItemStyle: styles.tabsItem,
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
      <Tabs.Screen
        name="toko"
        options={{
          title: "Toko",
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <FontAwesome5
              name="store"
              size={24}
              color={focused ? "#007AFF" : "#999"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="akun"
        options={{
          title: "Akun",
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={focused ? "#007AFF" : "#999"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pesanan"
        options={{
          title: "Pemesanan",
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Feather
              name="box"
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
    borderRadius: 50,
    marginHorizontal: 20,
    marginBottom: 36,
    height: 52,
    position: "absolute",
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderColor: "blue",
  },
  tabsItem: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default Layout;
