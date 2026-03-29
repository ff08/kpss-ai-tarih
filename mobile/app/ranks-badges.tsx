import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../components/ScreenHeader";
import { APP_BADGES } from "../constants/badges";
import { KPSS_TARIH_RANKS } from "../constants/ranks";
import type { ColorPalette } from "../constants/theme";
import { APP_TAGLINE } from "../constants/app";
import { useTheme } from "../contexts/ThemeContext";
import { useStudyProgress } from "../contexts/StudyProgressContext";
import { useRankProgress } from "../hooks/useRankProgress";
import {
  fetchCatalogRanks,
  fetchSubtopics,
  fetchTopics,
  type CatalogRank,
  type Subtopic,
  type Topic,
} from "../lib/api";
import { mergeRankDefinitions, type MergedRankDef } from "../lib/rankDefinitions";

const GRID_GAP = 10;
const PAGE_PAD = 16;

function GridCell(props: {
  title: string;
  subtitle: string;
  imageUrl: string | null;
  locked: boolean;
  variant: "rank" | "badge";
  colors: ColorPalette;
}) {
  const { title, subtitle, imageUrl, locked, variant, colors } = props;
  const s = cellStyles(colors);

  const showImage = Boolean(imageUrl);
  const dimmed = locked && showImage;

  return (
    <View style={[s.cell, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={s.thumbWrap}>
        {showImage ? (
          <Image
            source={{ uri: imageUrl! }}
            style={[s.thumb, dimmed && { opacity: 0.35 }]}
            contentFit="contain"
            transition={150}
          />
        ) : (
          <View style={[s.thumbPlaceholder, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            {!locked && variant === "rank" ? (
              <Text style={[s.fallbackGlyph, { color: colors.accent }]}>✦</Text>
            ) : null}
            {!locked && variant === "badge" ? (
              <Ionicons name="ribbon" size={36} color={colors.accent} />
            ) : null}
          </View>
        )}
        {locked ? (
          <View style={s.lockOverlay}>
            <Ionicons name="lock-closed" size={22} color="#fff" />
          </View>
        ) : null}
      </View>
      <Text style={[s.cellTitle, { color: colors.text }]} numberOfLines={2}>
        {title}
      </Text>
      <Text style={[s.cellSub, { color: colors.muted }]} numberOfLines={2}>
        {subtitle}
      </Text>
    </View>
  );
}

function cellStyles(_colors: ColorPalette) {
  return StyleSheet.create({
    cell: {
      borderRadius: 12,
      borderWidth: 1,
      padding: 8,
      alignItems: "center",
    },
    thumbWrap: {
      width: "100%",
      aspectRatio: 1,
      maxHeight: 88,
      marginBottom: 6,
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
    },
    thumb: { width: "100%", height: "100%" },
    thumbPlaceholder: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 10,
    },
    fallbackGlyph: { fontSize: 28, fontWeight: "700" },
    lockOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
    },
    cellTitle: { fontSize: 12, fontWeight: "700", textAlign: "center", lineHeight: 16, minHeight: 32 },
    cellSub: { fontSize: 10, textAlign: "center", marginTop: 2 },
  });
}

export default function RanksBadgesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { getSubtopic, reload: reloadProgress } = useStudyProgress();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopicsByTopicId, setSubtopicsByTopicId] = useState<Record<number, Subtopic[]>>({});
  const [apiRanks, setApiRanks] = useState<CatalogRank[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, rankRows] = await Promise.all([
        fetchTopics(),
        fetchCatalogRanks().catch((): CatalogRank[] => []),
      ]);
      setApiRanks(rankRows);
      const subPairs = await Promise.all(t.map((topic) => fetchSubtopics(topic.id)));
      const map: Record<number, Subtopic[]> = {};
      t.forEach((topic, i) => {
        map[topic.id] = subPairs[i]?.subtopics ?? [];
      });
      setTopics(t);
      setSubtopicsByTopicId(map);
    } catch {
      setTopics([]);
      setSubtopicsByTopicId({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void reloadProgress();
      void load();
    }, [reloadProgress, load]),
  );

  const sortedTopics = useMemo(() => [...topics].sort((a, b) => a.sortOrder - b.sortOrder), [topics]);

  const mergedRanks = useMemo(() => mergeRankDefinitions(KPSS_TARIH_RANKS, apiRanks), [apiRanks]);

  const rankProgress = useRankProgress(sortedTopics, subtopicsByTopicId, mergedRanks);

  const { completedUnitCount } = rankProgress;

  const winW = Dimensions.get("window").width;
  const colW = (winW - PAGE_PAD * 2 - GRID_GAP * 2) / 3;

  const rankCells = useMemo(
    () =>
      mergedRanks.map((r: MergedRankDef) => ({
        key: `rank-${r.level}`,
        title: r.title,
        subtitle: `Seviye ${r.level}`,
        imageUrl: r.imageUrl,
        locked: completedUnitCount < r.level,
      })),
    [mergedRanks, completedUnitCount],
  );

  const badgeCells = useMemo(
    () =>
      APP_BADGES.map((b) => ({
        key: b.id,
        title: b.title,
        subtitle: b.description,
        imageUrl: null as string | null,
        locked: completedUnitCount < b.minCompletedUnits,
      })),
    [completedUnitCount],
  );

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "top"]}>
      <ScreenHeader
        title="Rütbe ve Rozetlerim"
        tagline={APP_TAGLINE}
        showBack
        onBack={() => router.back()}
      />

      {loading && topics.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.muted, { color: colors.muted }]}>Yükleniyor…</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>Tarih Mühürü (Rütbeler)</Text>
          <Text style={[styles.sectionLead, { color: colors.muted }]}>
            Tamamladığın her ünite bir rütbe kazandırır. Kilitliler henüz ulaşmadığın mertebelerdir.
          </Text>
          <View style={[styles.gridRow, { gap: GRID_GAP }]}>
            {rankCells.map((c) => (
              <View key={c.key} style={{ width: colW }}>
                <GridCell
                  title={c.title}
                  subtitle={c.subtitle}
                  imageUrl={c.imageUrl}
                  locked={c.locked}
                  variant="rank"
                  colors={colors}
                />
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.accent, marginTop: 22 }]}>Rozetler</Text>
          <Text style={[styles.sectionLead, { color: colors.muted }]}>
            Ünite tamamlama hedeflerine ulaştıkça rozetler açılır.
          </Text>
          <View style={[styles.gridRow, { gap: GRID_GAP }]}>
            {badgeCells.map((c) => (
              <View key={c.key} style={{ width: colW }}>
                <GridCell
                  title={c.title}
                  subtitle={c.subtitle}
                  imageUrl={c.imageUrl}
                  locked={c.locked}
                  variant="badge"
                  colors={colors}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    scroll: { paddingHorizontal: PAGE_PAD, paddingBottom: 32 },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "800",
      letterSpacing: 0.6,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    sectionLead: { fontSize: 13, lineHeight: 19, marginBottom: 14 },
    gridRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
    },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    muted: { marginTop: 10, fontSize: 14 },
  });
}
