import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RandomTabIcon } from "../../components/RandomTabIcon";
import { useTheme } from "../../contexts/ThemeContext";

const ICON = 20;
/** Tüm sekmelerde ikon satırı aynı yükseklikte; label hizası tutarlı kalır */
const ICON_ROW_H = 36;

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 4,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 0,
          lineHeight: 12,
        },
        tabBarIconStyle: { marginBottom: 0 },
        tabBarItemStyle: { paddingVertical: 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana sayfa",
          tabBarIcon: ({ color }) => (
            <TabIconSlot>
              <Ionicons name="home-outline" size={ICON} color={color} />
            </TabIconSlot>
          ),
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: "Sınavlar",
          tabBarIcon: ({ color }) => (
            <TabIconSlot>
              <Ionicons name="calendar-outline" size={ICON} color={color} />
            </TabIconSlot>
          ),
        }}
      />
      <Tabs.Screen
        name="random"
        options={{
          title: "Rastgele",
          tabBarIcon: ({ color }) => (
            <TabIconSlot>
              <RandomTabIcon color={color} size={ICON} />
            </TabIconSlot>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "İstatistik",
          tabBarIcon: ({ color }) => (
            <TabIconSlot>
              <Ionicons name="stats-chart-outline" size={ICON} color={color} />
            </TabIconSlot>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "Hakkında",
          tabBarIcon: ({ color }) => (
            <TabIconSlot>
              <Ionicons name="information-circle-outline" size={ICON} color={color} />
            </TabIconSlot>
          ),
        }}
      />
    </Tabs>
  );
}

function TabIconSlot({ children }: { children: ReactNode }) {
  return <View style={styles.iconSlot}>{children}</View>;
}

const styles = StyleSheet.create({
  iconSlot: {
    height: ICON_ROW_H,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    marginBottom: 4,
  },
});
