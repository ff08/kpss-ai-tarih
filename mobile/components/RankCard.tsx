import { useMemo } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import type { ColorPalette } from "../constants/theme";
import type { RankProgressState } from "../hooks/useRankProgress";
import type { MergedRankDef } from "../lib/rankDefinitions";

type Props = {
  rankState: RankProgressState;
  /** Gösterilecek rütbe görseli (mevcut veya sonraki). */
  displayRank: MergedRankDef | null;
  colors: ColorPalette;
  /** Dış karta ek stil (ör. slider içinde alt boşluğu kapatmak için). */
  style?: ViewStyle;
  /** Genel yolculuk çubuğu (slider’da kazanılmış mühürlerde kapalı). */
  hideProgressBar?: boolean;
  /** Sıradaki kilitli mühür (görsel üzerinde kilit). */
  locked?: boolean;
  /** Varsayılan seviye satırının yerine (ör. belirli bir mühür slaytı). */
  levelLineOverride?: string | null;
  /** Kazanılmış mühür slaytı — altta “Kazanıldı” / kilitte kısa açıklama. */
  footerHint?: "earned" | "locked" | "none";
};

export function RankCard({
  rankState,
  displayRank,
  colors,
  style,
  hideProgressBar = false,
  locked = false,
  levelLineOverride,
  footerHint = "none",
}: Props) {
  const { completedUnitCount, maxLevel, overallProgress } = rankState;
  const s = useMemo(() => themed(colors), [colors]);

  const levelLine =
    levelLineOverride ??
    `Seviye ${Math.min(completedUnitCount, maxLevel)} / ${maxLevel}`;

  const footer =
    footerHint === "earned" ? (
      <Text style={[s.footerStamp, { color: colors.accent }]}>Kazanıldı</Text>
    ) : footerHint === "locked" ? (
      <Text style={[s.footerStamp, { color: colors.muted }]}>
        Bir ünite tamamlayınca bu mühür açılır.
      </Text>
    ) : null;

  return (
    <View style={[s.card, { borderColor: colors.border, backgroundColor: colors.card }, style]}>
      <View style={s.topRow}>
        <View style={s.textBlock}>
          <Text style={s.brand}>Tarih Mühürü</Text>
          <Text style={s.levelLine}>{levelLine}</Text>
          <Text style={s.rankName}>{displayRank?.title ?? "Yolun başı"}</Text>
          {displayRank?.characteristic ? (
            <Text style={[s.rankHint, locked && s.rankHintLocked]} numberOfLines={locked ? 4 : 3}>
              {displayRank.characteristic}
            </Text>
          ) : (
            <Text style={s.rankHint}>Üniteleri sırayla tamamladıkça rütben yükselir.</Text>
          )}
        </View>
        <View style={s.imageWrap}>
          <View style={s.imageBox}>
            {displayRank?.imageUrl ? (
              <Image
                source={{ uri: displayRank.imageUrl }}
                style={[s.thumb, locked && s.thumbLocked]}
                contentFit="contain"
                transition={150}
              />
            ) : (
              <View style={[s.thumbPlaceholder, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Text style={[s.thumbGlyph, { color: colors.accent }]}>✦</Text>
              </View>
            )}
            {locked ? (
              <View style={s.lockOverlay} pointerEvents="none">
                <View style={[s.lockCircle, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <Ionicons name="lock-closed" size={28} color={colors.muted} />
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {hideProgressBar ? (
        footer ? (
          <View style={s.footerSlot}>{footer}</View>
        ) : null
      ) : (
        <View style={[s.smoothTrack, { backgroundColor: colors.surface }]}>
          <View
            style={[
              s.smoothFill,
              {
                width: `${Math.round(overallProgress * 100)}%`,
                backgroundColor: colors.accent,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

function themed(colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      borderRadius: 16,
      borderWidth: 1,
      paddingTop: 0,
      paddingHorizontal: 14,
      paddingBottom: 12,
      marginHorizontal: 0,
      marginBottom: 14,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 8,
    },
    /** Üst padding yalnızca metin tarafında; görsel kart üstüne hizalı (paddingTop yok). */
    textBlock: {
      flex: 1,
      minWidth: 0,
      paddingTop: 12,
      paddingRight: 4,
    },
    imageWrap: {
      flexShrink: 0,
    },
    imageBox: {
      width: 168,
      height: 168,
      position: "relative",
    },
    thumbLocked: {
      opacity: 0.38,
    },
    lockOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "center",
    },
    lockCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    rankHintLocked: {
      opacity: 0.85,
    },
    footerSlot: {
      minHeight: 8,
      marginTop: 4,
      paddingBottom: 2,
    },
    footerStamp: {
      fontSize: 12,
      fontWeight: "700",
      lineHeight: 17,
    },
    brand: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 2,
    },
    levelLine: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "800",
      marginBottom: 10,
      lineHeight: 22,
    },
    rankName: { color: colors.text, fontSize: 17, fontWeight: "700", marginBottom: 2, lineHeight: 22 },
    rankHint: { color: colors.muted, fontSize: 13, lineHeight: 18 },
    thumb: { width: 168, height: 168, borderRadius: 22 },
    thumbPlaceholder: {
      width: 168,
      height: 168,
      borderRadius: 22,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    thumbGlyph: { fontSize: 66, fontWeight: "700" },
    smoothTrack: {
      height: 8,
      borderRadius: 4,
      overflow: "hidden",
      marginTop: 0,
      marginBottom: 0,
    },
    smoothFill: {
      height: "100%",
      borderRadius: 4,
    },
  });
}
