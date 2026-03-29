import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import type { ColorPalette } from "../constants/theme";
import type { RankProgressState } from "../hooks/useRankProgress";
import type { MergedRankDef } from "../lib/rankDefinitions";

type Props = {
  rankState: RankProgressState;
  /** Gösterilecek rütbe görseli (mevcut veya sonraki). */
  displayRank: MergedRankDef | null;
  colors: ColorPalette;
};

export function RankCard({ rankState, displayRank, colors }: Props) {
  const { completedUnitCount, maxLevel, overallProgress } = rankState;
  const s = useMemo(() => themed(colors), [colors]);

  const segments = useMemo(() => Array.from({ length: maxLevel }, (_, i) => i < completedUnitCount), [
    maxLevel,
    completedUnitCount,
  ]);

  return (
    <View style={[s.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Text style={s.brand}>Tarih Mühürü</Text>
      <Text style={s.levelLine}>
        Seviye {Math.min(completedUnitCount, maxLevel)} / {maxLevel}
      </Text>
      <View style={s.row}>
        <View style={s.textCol}>
          <Text style={s.rankName}>{displayRank?.title ?? "Yolun başı"}</Text>
          {displayRank?.characteristic ? (
            <Text style={s.rankHint} numberOfLines={3}>
              {displayRank.characteristic}
            </Text>
          ) : (
            <Text style={s.rankHint}>Üniteleri sırayla tamamladıkça rütben yükselir.</Text>
          )}
        </View>
        {displayRank?.imageUrl ? (
          <Image source={{ uri: displayRank.imageUrl }} style={s.thumb} contentFit="contain" transition={150} />
        ) : (
          <View style={[s.thumbPlaceholder, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Text style={[s.thumbGlyph, { color: colors.accent }]}>✦</Text>
          </View>
        )}
      </View>

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

      <View style={s.segments}>
        {segments.map((filled, i) => (
          <View
            key={i}
            style={[
              s.seg,
              { backgroundColor: filled ? colors.accent : colors.border, opacity: filled ? 1 : 0.45 },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function themed(colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      borderRadius: 16,
      borderWidth: 1,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 14,
    },
    brand: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    levelLine: { color: colors.text, fontSize: 18, fontWeight: "800", marginBottom: 12 },
    row: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 },
    textCol: { flex: 1, minWidth: 0 },
    rankName: { color: colors.text, fontSize: 17, fontWeight: "700", marginBottom: 4 },
    rankHint: { color: colors.muted, fontSize: 13, lineHeight: 19 },
    thumb: { width: 56, height: 56, borderRadius: 12 },
    thumbPlaceholder: {
      width: 56,
      height: 56,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    thumbGlyph: { fontSize: 22, fontWeight: "700" },
    smoothTrack: {
      height: 8,
      borderRadius: 4,
      overflow: "hidden",
      marginBottom: 10,
    },
    smoothFill: {
      height: "100%",
      borderRadius: 4,
    },
    segments: {
      flexDirection: "row",
      gap: 3,
    },
    seg: {
      flex: 1,
      height: 5,
      borderRadius: 2,
    },
  });
}
