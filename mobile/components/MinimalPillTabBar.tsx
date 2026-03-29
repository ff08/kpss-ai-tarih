import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const ICON = 22;

/** Sadece alt hap şeritte görünen sekmeler (href: null olanlar gizlenir). */
const BAR_ORDER = ["index", "exams", "random", "about"] as const;

/**
 * Minimal, yüzen hap şeklinde alt gezinme: etiket yok; seçili sekmede iç pill vurgusu.
 */
export function MinimalPillTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";

  const pillBg = isDark ? "#141a22" : colors.surface;
  const pillBorder = isDark ? "#2a3544" : colors.border;
  const activeInnerBg = isDark ? "#2a3140" : colors.tagBg;
  const activeIcon = isDark ? "#ffffff" : colors.text;
  const inactiveIcon = isDark ? "rgba(255,255,255,0.52)" : colors.muted;

  const bottomPad = Math.max(insets.bottom, 12);

  const routesInOrder = BAR_ORDER.map((name) => state.routes.find((r) => r.name === name)).filter(
    (r): r is NonNullable<typeof r> => r != null,
  );

  const activeName = state.routes[state.index]?.name ?? "";

  return (
    <View style={[styles.outer, { paddingBottom: bottomPad }]}>
      <View style={[styles.pill, { backgroundColor: pillBg, borderColor: pillBorder }]}>
        {routesInOrder.map((route) => {
          const isFocused = activeName === route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabSlot}
            >
              {isFocused ? (
                <View style={[styles.activePill, { backgroundColor: activeInnerBg }]}>
                  {renderRouteIcon(route.name, true, activeIcon, inactiveIcon)}
                </View>
              ) : (
                <View style={styles.inactiveSlot}>{renderRouteIcon(route.name, false, activeIcon, inactiveIcon)}</View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function renderRouteIcon(
  routeName: string,
  focused: boolean,
  activeColor: string,
  inactiveColor: string,
) {
  const c = focused ? activeColor : inactiveColor;
  switch (routeName) {
    case "index":
      return <Ionicons name={focused ? "home" : "home-outline"} size={ICON} color={c} />;
    case "exams":
      return <Ionicons name={focused ? "calendar" : "calendar-outline"} size={ICON} color={c} />;
    case "random":
      return (
        <Ionicons name={focused ? "compass" : "compass-outline"} size={ICON} color={c} />
      );
    case "about":
      return <Ionicons name={focused ? "person" : "person-outline"} size={ICON} color={c} />;
    case "stats":
      return <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={ICON} color={c} />;
    default:
      return <Ionicons name="help-circle-outline" size={ICON} color={inactiveColor} />;
  }
}

const styles = StyleSheet.create({
  outer: {
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "transparent",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 440,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 2,
    overflow: "visible",
  },
  tabSlot: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    overflow: "visible",
  },
  activePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
    minWidth: 36,
    overflow: "visible",
  },
  inactiveSlot: {
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
    minWidth: 32,
    overflow: "visible",
  },
});
