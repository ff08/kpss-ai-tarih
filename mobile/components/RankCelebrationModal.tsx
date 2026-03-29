import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ColorPalette } from "../constants/theme";
import type { MergedRankDef } from "../lib/rankDefinitions";
import { Image } from "expo-image";
import { OwlSealSvg } from "./OwlSealSvg";

type Props = {
  visible: boolean;
  rank: MergedRankDef | null;
  colors: ColorPalette;
  onClose: () => void;
};

export function RankCelebrationModal({ visible, rank, colors, onClose }: Props) {
  const insets = useSafeAreaInsets();

  if (!rank) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }]}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {rank.imageUrl ? (
            <Image
              source={{ uri: rank.imageUrl }}
              style={styles.rankImage}
              contentFit="contain"
              transition={200}
            />
          ) : (
            <OwlSealSvg size={132} accentColor={colors.accent} />
          )}
          <Text style={[styles.title, { color: colors.text }]}>Yeni Mertebe: {rank.title}</Text>
          <Text style={[styles.sub, { color: colors.muted }]}>Mühür bu başarıyı tescilledi!</Text>
          {rank.characteristic ? (
            <Text style={[styles.desc, { color: colors.text }]} numberOfLines={4}>
              {rank.characteristic}
            </Text>
          ) : null}
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              { backgroundColor: colors.accent, opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Tamam"
          >
            <Text style={[styles.btnText, { color: colors.onAccent }]}>Harika!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
  },
  rankImage: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 26,
  },
  sub: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.92,
  },
  btn: {
    alignSelf: "stretch",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: { fontSize: 17, fontWeight: "700" },
});
