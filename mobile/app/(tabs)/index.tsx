import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { RankCard } from "../../components/RankCard";
import { RankCelebrationModal } from "../../components/RankCelebrationModal";
import { ScreenHeader } from "../../components/ScreenHeader";
import { ProgressRing } from "../../components/ProgressRing";
import { KPSS_TARIH_RANKS } from "../../constants/ranks";
import type { ColorPalette } from "../../constants/theme";
import { useTheme } from "../../contexts/ThemeContext";
import { APP_NAME, APP_TAGLINE } from "../../constants/app";
import { UNLOCK_NEXT_TOPIC_PERCENT } from "../../constants/unlock";
import { useRankProgress } from "../../hooks/useRankProgress";
import { getTimeOfDayGreeting } from "../../lib/greeting";
import {
  fetchCatalogRanks,
  fetchSubtopics,
  fetchTopics,
  type CatalogRank,
  type Subtopic,
  type Topic,
} from "../../lib/api";
import { mergeRankDefinitions, type MergedRankDef } from "../../lib/rankDefinitions";
import { consumeRankCelebrationIfNeeded } from "../../lib/rankCelebrationStorage";
import { useAuth } from "../../contexts/AuthContext";
import { useStudyProgress } from "../../contexts/StudyProgressContext";
import {
  aggregateWeightedPercent,
  topicTotalCardsFromTopic,
} from "../../lib/studyProgress";

const PAD = 16;
const GRID_GAP = 12;

type TopicRow = {
  topic: Topic;
  percent: number;
  unlocked: boolean;
};

function TopicUnitCard(props: {
  item: TopicRow;
  cardWidth: number;
  colors: ColorPalette;
  onOpen: () => void;
  onLockedPress: () => void;
}) {
  const { item, cardWidth, colors, onOpen, onLockedPress } = props;
  const s = useMemo(() => unitCardStyles(colors), [colors]);

  return (
    <Pressable
      style={({ pressed }) => [
        s.card,
        { width: cardWidth },
        !item.unlocked && s.cardLocked,
        pressed && item.unlocked && s.cardPressed,
      ]}
      onPress={() => (item.unlocked ? onOpen() : onLockedPress())}
      accessibilityRole="button"
      accessibilityLabel={item.unlocked ? item.topic.title : `${item.topic.title} kilitli`}
    >
      <Text style={[s.title, !item.unlocked && s.titleLocked]} numberOfLines={3}>
        {item.topic.title}
      </Text>
      <View style={s.visual}>
        {item.unlocked ? (
          <ProgressRing percent={item.percent} size={56} strokeWidth={4} colors={colors} />
        ) : (
          <View style={[s.lockCircle, { borderColor: colors.border }]}>
            <Ionicons name="lock-closed" size={26} color={colors.muted} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

function unitCardStyles(colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingTop: 14,
      paddingBottom: 16,
      minHeight: 148,
      justifyContent: "space-between",
    },
    cardLocked: { opacity: 0.78 },
    cardPressed: { opacity: 0.92 },
    title: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 20,
      minHeight: 60,
    },
    titleLocked: { color: colors.muted },
    visual: { alignItems: "center", justifyContent: "center", paddingTop: 4 },
    lockCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },
  });
}

export default function TopicsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { user } = useAuth();
  const { getOverall, reload: reloadProgress } = useStudyProgress();

  useFocusEffect(
    useCallback(() => {
      void reloadProgress();
    }, [reloadProgress]),
  );

  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopicsByTopicId, setSubtopicsByTopicId] = useState<Record<number, Subtopic[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState(() => getTimeOfDayGreeting());
  const [apiRanks, setApiRanks] = useState<CatalogRank[]>([]);
  const [celebrationRank, setCelebrationRank] = useState<MergedRankDef | null>(null);

  useEffect(() => {
    setGreeting(getTimeOfDayGreeting());
    const id = setInterval(() => setGreeting(getTimeOfDayGreeting()), 60_000);
    return () => clearInterval(id);
  }, []);

  const greetingLine = useMemo(() => {
    const name = user?.displayName?.trim() || "Öğrenci";
    return `${greeting}, ${name}`;
  }, [greeting, user?.displayName]);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const t = await fetchTopics();
      const subPairs = await Promise.all(t.map((topic) => fetchSubtopics(topic.id)));
      const map: Record<number, Subtopic[]> = {};
      t.forEach((topic, i) => {
        map[topic.id] = subPairs[i]?.subtopics ?? [];
      });
      setTopics(t);
      setSubtopicsByTopicId(map);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const sortedTopics = useMemo(() => [...topics].sort((a, b) => a.sortOrder - b.sortOrder), [topics]);

  const mergedRanks = useMemo(() => mergeRankDefinitions(KPSS_TARIH_RANKS, apiRanks), [apiRanks]);

  const rankProgress = useRankProgress(sortedTopics, subtopicsByTopicId, mergedRanks);

  const rankCardDisplay = useMemo(
    () => rankProgress.currentRank ?? mergedRanks[0] ?? null,
    [rankProgress.currentRank, mergedRanks],
  );

  useEffect(() => {
    if (loading || mergedRanks.length === 0) return;
    const cu = rankProgress.completedUnitCount;
    void consumeRankCelebrationIfNeeded(cu).then((level) => {
      if (level !== null) {
        const def = mergedRanks[level - 1];
        if (def) setCelebrationRank(def);
      }
    });
  }, [loading, mergedRanks, rankProgress.completedUnitCount]);

  const topicRows = useMemo<TopicRow[]>(() => {
    const percents = sortedTopics.map((topic) =>
      aggregateWeightedPercent(subtopicsByTopicId[topic.id] ?? [], getOverall),
    );
    const unlocked = sortedTopics.map((topic, i) => {
      if (i === 0) return true;
      const prev = sortedTopics[i - 1]!;
      if (topicTotalCardsFromTopic(prev) === 0) return true;
      return (percents[i - 1] ?? 0) >= UNLOCK_NEXT_TOPIC_PERCENT;
    });
    return sortedTopics.map((topic, i) => ({
      topic,
      percent: percents[i] ?? 0,
      unlocked: unlocked[i] ?? false,
    }));
  }, [sortedTopics, subtopicsByTopicId, getOverall]);

  const globalPercent = useMemo(() => {
    const all = sortedTopics.flatMap((t) => subtopicsByTopicId[t.id] ?? []);
    return aggregateWeightedPercent(all, getOverall);
  }, [sortedTopics, subtopicsByTopicId, getOverall]);

  const { width: winW } = Dimensions.get("window");
  const cardWidth = (winW - PAD * 2 - GRID_GAP) / 2;

  const onLockedPress = useCallback(() => {
    Alert.alert(
      "Kilitli ünite",
      `Bir sonraki üniteyi açmak için önceki ünitede en az %${UNLOCK_NEXT_TOPIC_PERCENT} ilerleme kaydetmelisin.`,
    );
  }, []);

  if (loading && topics.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right"]}>
        <ScreenHeader title={APP_NAME} aboveTitle={greetingLine} tagline={APP_TAGLINE} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.muted}>Konular yükleniyor…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right"]}>
        <ScreenHeader title={APP_NAME} aboveTitle={greetingLine} tagline={APP_TAGLINE} />
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Bağlantı hatası</Text>
          <Text style={styles.muted}>{error}</Text>
          <Text style={styles.hint}>
            API&apos;nin çalıştığından emin olun (ör. `npm run dev` api klasöründe). Android emülatörde
            bilgisayarınızdaki API için 10.0.2.2:3000 kullanılır.
          </Text>
          <Pressable style={styles.retry} onPress={() => void load()}>
            <Text style={styles.retryText}>Yeniden dene</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <ScreenHeader title={APP_NAME} aboveTitle={greetingLine} tagline={APP_TAGLINE} />

      <RankCard rankState={rankProgress} displayRank={rankCardDisplay} colors={colors} />

      <View style={styles.summary}>
        <View style={styles.summaryTextCol}>
          <Text style={styles.summaryLabel}>Genel ilerleme</Text>
          <Text style={styles.summaryHint}>Kartları çalıştıkça yüzde artar</Text>
        </View>
        <ProgressRing percent={globalPercent} size={52} strokeWidth={4} colors={colors} />
      </View>

      <FlatList
        style={styles.listFlex}
        data={topicRows}
        keyExtractor={(item) => String(item.topic.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrap}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void load()} tintColor={colors.accent} />}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          <TopicUnitCard
            item={item}
            cardWidth={cardWidth}
            colors={colors}
            onOpen={() => router.push(`/topic/${item.topic.id}`)}
            onLockedPress={onLockedPress}
          />
        )}
      />

      <RankCelebrationModal
        visible={celebrationRank !== null}
        rank={celebrationRank}
        colors={colors}
        onClose={() => setCelebrationRank(null)}
      />
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    listFlex: { flex: 1 },
    gridContent: {
      paddingHorizontal: PAD,
      paddingBottom: 24,
    },
    columnWrap: {
      justifyContent: "space-between",
      marginBottom: GRID_GAP,
      gap: GRID_GAP,
    },
    summary: {
      marginHorizontal: PAD,
      marginBottom: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 16,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    summaryTextCol: { flex: 1, minWidth: 0 },
    summaryLabel: { color: colors.text, fontSize: 16, fontWeight: "700" },
    summaryHint: { color: colors.muted, fontSize: 12, marginTop: 4, lineHeight: 17 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: colors.bg },
    muted: { color: colors.muted, marginTop: 12, textAlign: "center", lineHeight: 20 },
    errorTitle: { color: colors.text, fontSize: 18, fontWeight: "600" },
    hint: { color: colors.muted, marginTop: 16, textAlign: "center", lineHeight: 20, fontSize: 13 },
    retry: {
      marginTop: 20,
      backgroundColor: colors.accent,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 10,
    },
    retryText: { color: colors.onAccent, fontWeight: "600" },
  });
}
