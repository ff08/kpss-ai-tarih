import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { APP_TAGLINE } from "../../constants/app";
import type { ColorPalette } from "../../constants/theme";
import { useStudyProgress } from "../../contexts/StudyProgressContext";
import { useTheme } from "../../contexts/ThemeContext";
import { fetchSubtopics, type Subtopic } from "../../lib/api";

export default function SubtopicsScreen() {
  const { colors } = useTheme();
  const { getOverall } = useStudyProgress();
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

  if (loading && subtopics.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ScreenHeader title="Alt konular" tagline={APP_TAGLINE} showBack rightSlot={null} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ScreenHeader title={title || "Alt konular"} tagline={APP_TAGLINE} showBack rightSlot={null} />
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
      <ScreenHeader title={title || "Alt konular"} tagline={APP_TAGLINE} showBack rightSlot={null} />
      <FlatList
        style={styles.listFlex}
        data={subtopics}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => void load()} tintColor={colors.accent} />
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const { percentDone, percentRemaining, hasContent } = getOverall(item.id, {
            informationCount: item.informationCount ?? 0,
            openQaCount: item.openQaCount ?? 0,
            mcqCount: item.mcqCount ?? 0,
          });
          return (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => router.push(`/subtopic/${item.id}`)}
            >
              <View style={styles.rowMain}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                {hasContent ? (
                  <>
                    <View style={styles.subProgressTrack}>
                      <View style={[styles.subProgressFill, { width: `${percentDone}%` }]} />
                    </View>
                    <Text style={styles.subProgressMeta}>
                      %{percentDone} tamamlandı · ~%{percentRemaining} kaldı
                    </Text>
                  </>
                ) : (
                  <Text style={styles.subProgressEmpty}>Bu alt konuda henüz kart yok</Text>
                )}
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    listFlex: { flex: 1 },
    list: { paddingHorizontal: 16, paddingBottom: 24 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    rowPressed: { opacity: 0.92 },
    rowMain: { flex: 1, minWidth: 0, paddingRight: 8 },
    rowTitle: { color: colors.text, fontSize: 15, lineHeight: 22 },
    subProgressTrack: {
      marginTop: 10,
      height: 5,
      borderRadius: 3,
      backgroundColor: colors.surface,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    subProgressFill: {
      height: "100%",
      borderRadius: 2,
      backgroundColor: colors.accent,
    },
    subProgressMeta: {
      marginTop: 6,
      color: colors.muted,
      fontSize: 12,
      fontWeight: "600",
      fontVariant: ["tabular-nums"],
    },
    subProgressEmpty: {
      marginTop: 8,
      color: colors.muted,
      fontSize: 12,
    },
    chevron: { color: colors.muted, fontSize: 22, fontWeight: "300" },
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
