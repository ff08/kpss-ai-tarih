import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  onPress: () => void;
  /** `header`: üst çubukta, progress alanının sağında (sabit konum). */
  variant?: "header" | "overlay";
};

/** Sarı uyarı ikonu — header sağ veya kart üzeri. */
export function CardReportButton({ onPress, variant = "overlay" }: Props) {
  const { colors } = useTheme();
  const btn = (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: colors.surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        pressed && { opacity: 0.88 },
      ]}
      onPress={(e) => {
        e.stopPropagation?.();
        onPress();
      }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel="İçerik hatası bildir"
    >
      <Ionicons name="warning" size={24} color="#CA8A04" />
    </Pressable>
  );

  if (variant === "header") {
    return <View style={styles.headerHost}>{btn}</View>;
  }

  return (
    <View style={styles.overlayHost} pointerEvents="box-none">
      {btn}
    </View>
  );
}

const styles = StyleSheet.create({
  overlayHost: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 50,
  },
  headerHost: {
    flexShrink: 0,
    marginLeft: 4,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  btn: {
    padding: 8,
    borderRadius: 999,
  },
});
