import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { MinimalPillTabBar } from "../../components/MinimalPillTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <MinimalPillTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarHiddenChrome,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Ana sayfa" }} />
      <Tabs.Screen name="exams" options={{ title: "Sınavlar" }} />
      <Tabs.Screen name="random" options={{ title: "Keşfet" }} />
      <Tabs.Screen name="about" options={{ title: "Hesabım" }} />
      <Tabs.Screen name="stats" options={{ href: null, title: "İstatistik" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  /** Varsayılan üst çizgi ve arka plan kaldırılır; hap bar tamamen özel çizer. */
  tabBarHiddenChrome: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
  },
});
