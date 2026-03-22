import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  onPress: () => void;
};

/** Sarı uyarı ikonu — kartın sağ üst köşesi (üst üste binen katman). */
export function CardReportButton({ onPress }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.host} pointerEvents="box-none">
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
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 50,
  },
  btn: {
    padding: 8,
    borderRadius: 999,
  },
});
