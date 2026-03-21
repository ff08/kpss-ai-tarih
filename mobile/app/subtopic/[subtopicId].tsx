import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchCards, fetchSubtopicMeta, type CardKind, type StudyCard } from "../../lib/api";
import { MdText } from "../../components/MdText";
import { FlipQaCard } from "../../components/FlipQaCard";
import { McqSlide } from "../../components/McqSlide";
import { ScreenHeader } from "../../components/ScreenHeader";
import { APP_TAGLINE } from "../../constants/app";
import type { ColorPalette } from "../../constants/theme";
import { useTheme } from "../../contexts/ThemeContext";

const MODE_LABELS: Record<CardKind, string> = {
  INFORMATION: "Bilgi kartları",
  OPEN_QA: "Soru–cevap",
  MCQ: "Çoktan seçmeli",
};

const MCQ_SECONDS_PER_QUESTION = 60;

function formatMcqTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default function CardDeckScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createSubtopicStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
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
  const [mcqTimeLeft, setMcqTimeLeft] = useState(MCQ_SECONDS_PER_QUESTION);
  const [mcqPaused, setMcqPaused] = useState(false);
  const deckProgressAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    if (mode !== "MCQ") return;
    setMcqTimeLeft(MCQ_SECONDS_PER_QUESTION);
    setMcqPaused(false);
  }, [mode, index]);

  useEffect(() => {
    if (mode !== "MCQ" || mcqPaused) return;
    const id = setInterval(() => {
      setMcqTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [mode, mcqPaused, index]);

  useEffect(() => {
    if (mode !== "INFORMATION" && mode !== "OPEN_QA") return;
    if (cards.length === 0) return;
    const target = (index + 1) / cards.length;
    Animated.timing(deckProgressAnim, {
      toValue: target,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [mode, index, cards.length]);

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
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ScreenHeader title="Alt konu" tagline={APP_TAGLINE} showBack rightSlot={null} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (error && !mode) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ScreenHeader title="Alt konu" tagline={APP_TAGLINE} showBack rightSlot={null} />
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (mode === null) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ScreenHeader title={subTitle || "Alt konu"} tagline={APP_TAGLINE} subtitle={topicTitle} showBack rightSlot={null} />
        <Text style={styles.modeIntro}>Nasıl çalışmak istersiniz?</Text>
        <View style={styles.modeList}>
            <Pressable
              style={({ pressed }) => [styles.modeRow, pressed && styles.modeRowPressed]}
              onPress={() => setMode("INFORMATION")}
            >
              <View style={styles.modeRowInner}>
                <Ionicons name="layers-outline" size={22} color={colors.accent} style={styles.modeIcon} />
                <View style={styles.modeRowTexts}>
                  <Text style={styles.modeRowTitle}>Bilgi kartları</Text>
                  <Text style={styles.modeRowSub}>Özet metinleri dikey kaydırarak okuyun</Text>
                </View>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.modeRow, pressed && styles.modeRowPressed]}
              onPress={() => setMode("OPEN_QA")}
            >
              <View style={styles.modeRowInner}>
                <Ionicons name="chatbubbles-outline" size={22} color={colors.accent} style={styles.modeIcon} />
                <View style={styles.modeRowTexts}>
                  <Text style={styles.modeRowTitle}>Soru–cevap</Text>
                  <Text style={styles.modeRowSub}>Karta dokununca cevap arka yüzde açılır</Text>
                </View>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.modeRow, pressed && styles.modeRowPressed]}
              onPress={() => setMode("MCQ")}
            >
              <View style={styles.modeRowInner}>
                <Ionicons name="list-circle-outline" size={22} color={colors.accent} style={styles.modeIcon} />
                <View style={styles.modeRowTexts}>
                  <Text style={styles.modeRowTitle}>Çoktan seçmeli</Text>
                  <Text style={styles.modeRowSub}>Şıklardan birini seçin, doğru/yanlış görün</Text>
                </View>
              </View>
            </Pressable>
          </View>
      </SafeAreaView>
    );
  }

  const headerSubtitle = topicTitle && subTitle ? `${topicTitle}\n${subTitle}` : topicTitle || subTitle || "";
  const modLeft = (
    <Pressable onPress={() => setMode(null)} hitSlop={12} accessibilityRole="button" accessibilityLabel="Mod seçimine dön">
      <Text style={{ color: colors.accent, fontSize: 15, fontWeight: "600" }}>‹ Mod seçimi</Text>
    </Pressable>
  );

  if (loading && cards.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ScreenHeader title={screenTitle} tagline={APP_TAGLINE} subtitle={headerSubtitle} leftSlot={modLeft} rightSlot={null} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ScreenHeader title={screenTitle} tagline={APP_TAGLINE} subtitle={headerSubtitle} leftSlot={modLeft} rightSlot={null} />
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
    );
  }

  if (cards.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ScreenHeader title={screenTitle} tagline={APP_TAGLINE} subtitle={headerSubtitle} leftSlot={modLeft} rightSlot={null} />
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Bu modda içerik yok</Text>
          <Text style={styles.emptySub}>Veritabanında bu alt konu için {MODE_LABELS[mode]} kaydı bulunmuyor.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const h = pageHeight ?? 400;

  const mcqRemaining = Math.max(0, cards.length - index);

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      {mode === "MCQ" ? (
        <View style={[styles.mcqFocusBar, { paddingTop: insets.top + 14 }]}>
          <View style={styles.mcqFocusRow}>
            <Pressable
              onPress={() => setMode(null)}
              style={styles.mcqModBtn}
              accessibilityRole="button"
              accessibilityLabel="Mod seçimine dön"
            >
              <Text style={styles.mcqModBtnText}>‹ Mod</Text>
            </Pressable>
            <View style={styles.mcqTimerCol}>
              <Text style={styles.mcqTimerText}>{formatMcqTime(mcqTimeLeft)}</Text>
              <Text style={styles.mcqRemainingSub}>Kalan soru: {mcqRemaining}</Text>
            </View>
            <View style={styles.mcqBarSpacer} />
          </View>
        </View>
      ) : (
        <View style={[styles.mcqFocusBar, { paddingTop: insets.top + 14 }]}>
          <View style={styles.mcqFocusRow}>
            <Pressable
              onPress={() => setMode(null)}
              style={styles.mcqModBtn}
              accessibilityRole="button"
              accessibilityLabel="Mod seçimine dön"
            >
              <Text style={styles.mcqModBtnText}>‹ Mod</Text>
            </Pressable>
            <View style={styles.deckProgressCol}>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: deckProgressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={styles.deckProgressMeta}>
                {index + 1} / {cards.length}
              </Text>
            </View>
            <View style={styles.mcqBarSpacer} />
          </View>
        </View>
      )}
      <View style={styles.listWrap} onLayout={onListLayout}>
        {pageHeight != null ? (
          <FlatList
            ref={listRef}
            data={cards}
            keyExtractor={(item) => item.id}
            extraData={{ mode, index, mcqTimeLeft }}
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
            renderItem={({ item, index: itemIndex }) => (
              <View style={[styles.page, { height: h }]}>
                {mode === "INFORMATION" ? (
                  <View style={styles.card}>
                    {item.tag ? (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{item.tag}</Text>
                      </View>
                    ) : null}
                    <ScrollView
                      style={styles.infoScroll}
                      contentContainerStyle={styles.infoScrollContent}
                      showsVerticalScrollIndicator={false}
                    >
                      <Text style={[styles.cardTitle, styles.infoText]}>{item.title}</Text>
                      <MdText style={[styles.cardBody, styles.infoText]}>{item.content}</MdText>
                    </ScrollView>
                  </View>
                ) : null}
                {mode === "OPEN_QA" ? (
                  <FlipQaCard question={item.title} answer={item.content} resetKey={item.id} hint={item.hint} />
                ) : null}
                {mode === "MCQ" ? (
                  <McqSlide
                    item={item}
                    isActive={index === itemIndex}
                    timeUp={mcqTimeLeft === 0 && index === itemIndex}
                    onAnswer={() => setMcqPaused(true)}
                  />
                ) : null}
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
          : mode === "MCQ"
            ? "Her soru için 1 dk; dikey kaydırarak ilerleyin"
            : "Dikey kaydırarak ileri ve geri gidebilirsiniz"}
      </Text>
    </SafeAreaView>
  );
}

function createSubtopicStyles(colors: ColorPalette) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeRowPressed: { opacity: 0.92 },
  modeRowInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modeIcon: { marginTop: 2 },
  modeRowTexts: { flex: 1, minWidth: 0 },
  modeRowTitle: { color: colors.text, fontSize: 16, fontWeight: "600", marginBottom: 4 },
  modeRowSub: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  mcqFocusBar: {
    backgroundColor: colors.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  mcqFocusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  mcqModBtn: { paddingVertical: 6, paddingRight: 8, minWidth: 56 },
  mcqModBtnText: { color: colors.accent, fontSize: 15, fontWeight: "600" },
  mcqTimerCol: { flex: 1, alignItems: "center", minWidth: 0 },
  mcqTimerText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  mcqRemainingSub: { color: colors.muted, fontSize: 13, fontWeight: "600", marginTop: 2 },
  mcqBarSpacer: { width: 56 },
  deckProgressCol: { flex: 1, minWidth: 0, alignItems: "stretch", justifyContent: "center" },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  deckProgressMeta: {
    marginTop: 6,
    textAlign: "center",
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
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
  infoScroll: { flex: 1 },
  infoScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingVertical: 4,
  },
  infoText: {
    textAlign: "left",
    alignSelf: "stretch",
    width: "100%",
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: colors.tagBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
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
  retryText: { color: colors.onAccent, fontWeight: "600" },
  changeMode: { marginTop: 20, padding: 12 },
  changeModeText: { color: colors.accent, fontSize: 15, fontWeight: "600", textAlign: "center" },
});
}
