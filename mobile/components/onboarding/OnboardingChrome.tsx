import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";

type Props = {
  children: ReactNode;
  /** 0–1 */
  progress: number;
  showBack?: boolean;
  onBack?: () => void;
};

export function OnboardingChrome({ children, progress, showBack = true, onBack }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const p = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.root, { backgroundColor: colors.bg, paddingTop: insets.top + 8 }]}>
      <View style={styles.topRow}>
        {showBack ? (
          <Pressable
            onPress={() => (onBack ? onBack() : router.back())}
            style={styles.backBtn}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Geri"
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <View style={[styles.fill, { width: `${p * 100}%`, backgroundColor: colors.accent }]} />
        </View>
        <View style={styles.backPlaceholder} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 22 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 28,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  backPlaceholder: { width: 40 },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
