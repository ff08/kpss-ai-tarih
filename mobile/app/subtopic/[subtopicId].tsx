import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  LayoutChangeEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchCards,
  fetchSubtopicMeta,
  parseMcqPayload,
  type CardKind,
  type StudyCard,
} from "../../lib/api";
import { MdText } from "../../components/MdText";
import { FlipQaCard } from "../../components/FlipQaCard";
import { colors } from "../../constants/theme";

const MODE_LABELS: Record<CardKind, string> = {
  INFORMATION: "Bilgi kartları",
  OPEN_QA: "Soru–cevap",
  MCQ: "Çoktan seçmeli",
};

export default function CardDeckScreen() {
  const { subtopicId } = useLocalSearchParams<{ subtopicId: string }>();
  const [topicTitle, setTopicTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [mode, setMode] = useState<CardKind | null>(null);
  const [cards, setCards] = useState<StudyCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [pageHeight, setPageHeight] = useState<number | null>(null);
  const listRef = useRef<FlatList<StudyCard>>(null);

  useEffect(() => {
    if (!subtopicId) return;
    let cancelled = false;
    setMetaLoading(true);
    setError(null);
    void fetchSubtopicMeta(subtopicId)
      .then((m) => {
        if (cancelled) return;
        setTopicTitle(m.topicTitle);
        setSubTitle(m.title);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Bir hata oluştu");
      })
      .finally(() => {
        if (!cancelled) setMetaLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [subtopicId]);

  const load = useCallback(async () => {
    if (!subtopicId || !mode) return;
    setError(null);
    setLoading(true);
    try {
      const data = await fetchCards(subtopicId, mode);
      setTopicTitle(data.topicTitle);
      setSubTitle(data.title);
      setCards(data.cards);
      setIndex(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [subtopicId, mode]);

  useEffect(() => {
    if (mode) void load();
  }, [load, mode]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setIndex(viewableItems[0].index);
    }
  }, []);

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;

  const onListLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && h !== pageHeight) {
      setPageHeight(h);
    }
  }, [pageHeight]);

  const screenTitle = mode ? MODE_LABELS[mode] : "Çalışma modu";

  if (metaLoading && !topicTitle) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error && !mode) {
    return (
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (mode === null) {
    return (
      <>
        <Stack.Screen options={{ title: subTitle || "Alt konu" }} />
        <SafeAreaView style={styles.safe} edges={["bottom"]}>
          <Text style={styles.breadcrumb} numberOfLines={2}>
            {topicTitle}
          </Text>
          <Text style={styles.modeIntro}>Nasıl çalışmak istersiniz?</Text>
          <View style={styles.modeList}>
            <Pressable
              style={({ pressed }) => [styles.modeRow, pressed && styles.modeRowPressed]}
              onPress={() => setMode("INFORMATION")}
            >
              <Text style={styles.modeRowTitle}>Bilgi kartları</Text>
              <Text style={styles.modeRowSub}>Özet metinleri dikey kaydırarak okuyun</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.modeRow, pressed && styles.modeRowPressed]}
              onPress={() => setMode("OPEN_QA")}
            >
              <Text style={styles.modeRowTitle}>Soru–cevap</Text>
              <Text style={styles.modeRowSub}>Karta dokununca cevap arka yüzde açılır</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.modeRow, pressed && styles.modeRowPressed]}
              onPress={() => setMode("MCQ")}
            >
              <Text style={styles.modeRowTitle}>Çoktan seçmeli</Text>
              <Text style={styles.modeRowSub}>Şıklardan birini seçin, doğru/yanlış görün</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (loading && cards.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: screenTitle }} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: screenTitle }} />
        <SafeAreaView style={styles.safe} edges={["bottom"]}>
          <View style={styles.centered}>
            <Text style={styles.error}>{error}</Text>
            <Pressable style={styles.retry} onPress={() => void load()}>
              <Text style={styles.retryText}>Yeniden dene</Text>
            </Pressable>
            <Pressable style={styles.changeMode} onPress={() => { setMode(null); setError(null); }}>
              <Text style={styles.changeModeText}>Mod seçimine dön</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (cards.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: screenTitle }} />
        <SafeAreaView style={styles.safe} edges={["bottom"]}>
          <View style={styles.topBar}>
            <Pressable onPress={() => setMode(null)} hitSlop={12}>
              <Text style={styles.backLink}>‹ Mod seçimi</Text>
            </Pressable>
          </View>
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>Bu modda içerik yok</Text>
            <Text style={styles.emptySub}>Veritabanında bu alt konu için {MODE_LABELS[mode]} kaydı bulunmuyor.</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const h = pageHeight ?? 400;

  return (
    <>
      <Stack.Screen options={{ title: screenTitle }} />
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <View style={styles.topBar}>
          <Pressable onPress={() => setMode(null)} hitSlop={12}>
            <Text style={styles.backLink}>‹ Mod seçimi</Text>
          </Pressable>
        </View>
        <Text style={styles.breadcrumb} numberOfLines={1}>
          {topicTitle}
        </Text>
        <View style={styles.pagerMeta}>
          <Text style={styles.counter}>
            {index + 1} / {cards.length}
          </Text>
        </View>
        <View style={styles.listWrap} onLayout={onListLayout}>
          {pageHeight != null ? (
            <FlatList
              ref={listRef}
              data={cards}
              keyExtractor={(item) => item.id}
              extraData={mode}
              pagingEnabled
              showsVerticalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewConfig}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={() => void load()} tintColor={colors.accent} />
              }
              getItemLayout={(_, i) => ({
                length: h,
                offset: h * i,
                index: i,
              })}
              renderItem={({ item }) => (
                <View style={[styles.page, { height: h }]}>
                  {mode === "INFORMATION" ? (
                    <View style={styles.card}>
                      {item.tag ? (
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>{item.tag}</Text>
                        </View>
                      ) : null}
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <MdText style={styles.cardBody}>{item.content}</MdText>
                      </ScrollView>
                    </View>
                  ) : null}
                  {mode === "OPEN_QA" ? (
                    <FlipQaCard question={item.title} answer={item.content} resetKey={item.id} />
                  ) : null}
                  {mode === "MCQ" ? <McqSlide item={item} /> : null}
                </View>
              )}
            />
          ) : (
            <View style={styles.listPlaceholder} />
          )}
        </View>
        <Text style={styles.swipeHint}>
          {mode === "OPEN_QA"
            ? "Dikey kaydırın; cevap için karta dokunun"
            : "Dikey kaydırarak ileri ve geri gidebilirsiniz"}
        </Text>
      </SafeAreaView>
    </>
  );
}

function McqSlide({ item }: { item: StudyCard }) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [item.id]);

  let payload: ReturnType<typeof parseMcqPayload>;
  try {
    payload = parseMcqPayload(item.content);
  } catch {
    return (
      <View style={styles.card}>
        <Text style={styles.error}>Çoktan seçmeli verisi okunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {item.tag ? (
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
      ) : null}
      <Text style={styles.cardTitle}>{item.title}</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.mcqList}>
        {payload.options.map((opt, i) => {
          const show = selected !== null;
          const correct = i === payload.correctIndex;
          const isSel = selected === i;
          return (
            <Pressable
              key={i}
              onPress={() => selected === null && setSelected(i)}
              style={[
                styles.option,
                show && correct && styles.optionCorrect,
                show && isSel && !correct && styles.optionWrong,
              ]}
            >
              <Text style={styles.optionLetter}>{String.fromCharCode(65 + i)}.</Text>
              <Text style={styles.optionText}>{opt}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {selected !== null ? (
        <Text style={styles.mcqFeedback}>
          {selected === payload.correctIndex ? "Doğru" : "Yanlış — doğru şık işaretlendi"}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: { paddingHorizontal: 16, paddingBottom: 4 },
  backLink: { color: colors.accent, fontSize: 15, fontWeight: "600" },
  breadcrumb: {
    color: colors.muted,
    fontSize: 13,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  modeIntro: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "600",
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  modeList: { paddingHorizontal: 16, gap: 10 },
  modeRow: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeRowPressed: { opacity: 0.92 },
  modeRowTitle: { color: colors.text, fontSize: 16, fontWeight: "600", marginBottom: 6 },
  modeRowSub: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  pagerMeta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  counter: { color: colors.accent, fontSize: 13, fontWeight: "600" },
  listWrap: { flex: 1 },
  listPlaceholder: { flex: 1 },
  page: {
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: "100%",
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: colors.tagBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  tagText: { color: colors.accent, fontSize: 12, fontWeight: "600" },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
    lineHeight: 28,
  },
  cardBody: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  swipeHint: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg },
  error: { color: colors.muted, padding: 24, textAlign: "center" },
  emptyWrap: { flex: 1, justifyContent: "center", padding: 28 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "600", marginBottom: 10 },
  emptySub: { color: colors.muted, lineHeight: 22, fontSize: 15 },
  retry: {
    marginTop: 16,
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: { color: "#0f1419", fontWeight: "600" },
  changeMode: { marginTop: 20, padding: 12 },
  changeModeText: { color: colors.accent, fontSize: 15, fontWeight: "600", textAlign: "center" },
  mcqList: { paddingBottom: 8, gap: 10 },
  option: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  optionCorrect: { borderColor: "#4caf50", backgroundColor: "#1a2e1f" },
  optionWrong: { borderColor: "#e57373", backgroundColor: "#2e1a1a" },
  optionLetter: { color: colors.accent, fontWeight: "700", minWidth: 22 },
  optionText: { color: colors.text, fontSize: 15, flex: 1, lineHeight: 22 },
  mcqFeedback: { marginTop: 12, color: colors.muted, fontSize: 13, textAlign: "center" },
});
