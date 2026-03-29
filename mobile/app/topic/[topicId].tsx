import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { StudyModePath } from "../../components/StudyModePath";
import { APP_TAGLINE } from "../../constants/app";
import type { ColorPalette } from "../../constants/theme";
import { useStudyProgress } from "../../contexts/StudyProgressContext";
import { useTheme } from "../../contexts/ThemeContext";
import { fetchSubtopics, type Subtopic } from "../../lib/api";
import { characterImageForTopicSubtopic } from "../../constants/topicPathCharacters";
import { buildSubtopicCardDescription } from "../../lib/subtopicStrings";
import {
  buildFullTopicPath,
  getTopicPathStepStates,
  isSubtopicFullyComplete,
  isSubtopicUnlockedByOrder,
  subtopicCountsFromApi,
} from "../../lib/studyProgress";

export default function TopicStudyPathScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const { colors } = useTheme();
  const { getSubtopic, progress } = useStudyProgress();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!topicId) return;
    setError(null);
    setLoading(true);
    try {
      const data = await fetchSubtopics(topicId);
      setTitle(data.title);
      setSubtopics(data.subtopics);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    void load();
  }, [load]);

  const sortedSubtopics = useMemo(
    () => [...subtopics].sort((a, b) => a.sortOrder - b.sortOrder),
    [subtopics],
  );

  const topicPathSteps = useMemo(() => {
    const flat = buildFullTopicPath(sortedSubtopics);
    return getTopicPathStepStates(flat, sortedSubtopics, getSubtopic);
  }, [sortedSubtopics, getSubtopic, progress]);

  const topicSections = useMemo(() => {
    return sortedSubtopics.map((st, index) => ({
      subtopicId: st.id,
      title: st.title,
      description: buildSubtopicCardDescription(st, index),
      locked: !isSubtopicUnlockedByOrder(st.id, sortedSubtopics, getSubtopic),
      characterImage: characterImageForTopicSubtopic(topicId ?? "", index),
      steps: topicPathSteps.filter((s) => s.subtopicId === st.id),
    }));
  }, [sortedSubtopics, topicPathSteps, getSubtopic, progress, topicId]);

  const allSubtopicsComplete = useMemo(() => {
    if (sortedSubtopics.length === 0) return false;
    return sortedSubtopics.every((s) =>
      isSubtopicFullyComplete(getSubtopic(s.id), subtopicCountsFromApi(s)),
    );
  }, [sortedSubtopics, getSubtopic, progress]);

  if (loading && subtopics.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ScreenHeader title="Konu" tagline={APP_TAGLINE} showBack rightSlot={null} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ScreenHeader title={title || "Konu"} tagline={APP_TAGLINE} showBack rightSlot={null} />
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.retry} onPress={() => void load()}>
            <Text style={styles.retryText}>Yeniden dene</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <ScreenHeader title={title || "Konu"} tagline={APP_TAGLINE} showBack rightSlot={null} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void load()} tintColor={colors.accent} />}
      >
        <Text style={styles.pathTitle}>Çalışma yolu</Text>
        <Text style={styles.pathSub}>
          Tüm alt konuları aşağıda görürsünüz. Kilitli bölümler, sıradaki alt konuyu bitirince açılır; modlar yine sırayla
          ilerler.
        </Text>

        {sortedSubtopics.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Alt konu yok</Text>
            <Text style={styles.emptySub}>Bu konuya henüz alt konu eklenmemiş.</Text>
          </View>
        ) : (
          <StudyModePath
            width={windowWidth}
            topicSections={topicSections}
            colors={colors}
            onPressStep={({ kind, subtopicId }) => {
              if (subtopicId == null) return;
              const st = subtopics.find((x) => x.id === subtopicId);
              if (!st) return;
              router.push({
                pathname: "/subtopic/[subtopicId]",
                params: {
                  subtopicId: String(subtopicId),
                  subtopicTitle: st.title,
                  topicTitle: title,
                  informationCount: String(st.informationCount ?? 0),
                  openQaCount: String(st.openQaCount ?? 0),
                  wordGameCount: String(st.wordGameCount ?? 0),
                  mcqCount: String(st.mcqCount ?? 0),
                  initialMode: kind,
                  fromTopic: "1",
                },
              });
            }}
          />
        )}

        {sortedSubtopics.length > 1 && !allSubtopicsComplete ? (
          <Text style={styles.footerHint}>
            Kilitli alt konu kartları, bir önceki alt konudaki tüm modlar bitince açılır.
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 32 },
    pathTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      paddingHorizontal: 20,
      marginTop: 8,
      marginBottom: 8,
    },
    pathSub: {
      color: colors.muted,
      fontSize: 14,
      lineHeight: 20,
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    emptyBox: {
      marginHorizontal: 16,
      padding: 20,
      borderRadius: 14,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyTitle: { color: colors.text, fontSize: 16, fontWeight: "600", marginBottom: 8 },
    emptySub: { color: colors.muted, fontSize: 14, lineHeight: 20 },
    footerHint: {
      color: colors.muted,
      fontSize: 13,
      lineHeight: 18,
      paddingHorizontal: 20,
      marginTop: 16,
    },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: colors.bg },
    error: { color: colors.muted, textAlign: "center" },
    retry: {
      marginTop: 16,
      backgroundColor: colors.accent,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 10,
    },
    retryText: { color: colors.onAccent, fontWeight: "600" },
  });
}
