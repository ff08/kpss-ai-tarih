import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { ParamListBase } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlipQaCard } from "../../components/FlipQaCard";
import { McqSlide } from "../../components/McqSlide";
import { MdText } from "../../components/MdText";
import type { ColorPalette } from "../../constants/theme";
import { useTheme } from "../../contexts/ThemeContext";
import { pickRandomStudyCard, type RandomPickResult } from "../../lib/pickRandomStudyCard";

const MCQ_SECONDS = 60;

type RandomFeedItem = RandomPickResult & { feedKey: string };

function makeFeedKey(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function formatMcqTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

const PREFETCH_AHEAD = 2;
const MIN_INITIAL_CARDS = 3;
const MAX_PICK_ATTEMPTS = 24;

type RandomStyles = ReturnType<typeof createStyles>;

const RandomFeedRow = memo(
  function RandomFeedRow({
    item,
    itemIndex,
    pageHeight,
    visibleIndex,
    mcqTimeLeft,
    mcqPaused,
    onMcqAnswer,
    styles,
  }: {
    item: RandomFeedItem;
    itemIndex: number;
    pageHeight: number;
    visibleIndex: number;
    mcqTimeLeft: number;
    mcqPaused: boolean;
    onMcqAnswer: () => void;
    styles: RandomStyles;
  }) {
    const isMcqActive = item.kind === "MCQ" && visibleIndex === itemIndex;
    return (
      <View style={[styles.page, { height: pageHeight }]}>
        <Text style={styles.metaText} numberOfLines={3}>
          {item.topicTitle} · {item.subtopicTitle}
        </Text>
        <View style={styles.cardWrap}>
          {item.kind === "INFORMATION" ? (
            <View style={styles.card}>
              <ScrollView
                style={styles.infoScroll}
                contentContainerStyle={styles.infoScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={[styles.cardTitle, styles.infoText]}>{item.card.title}</Text>
                <MdText style={[styles.cardBody, styles.infoText]}>{item.card.content}</MdText>
              </ScrollView>
            </View>
          ) : null}
          {item.kind === "OPEN_QA" ? (
            <FlipQaCard
              question={item.card.title}
              answer={item.card.content}
              resetKey={item.card.id}
              hint={item.card.hint}
            />
          ) : null}
          {item.kind === "MCQ" ? (
            <McqSlide
              item={item.card}
              isActive={visibleIndex === itemIndex}
              timeUp={mcqTimeLeft === 0 && isMcqActive}
              onAnswer={onMcqAnswer}
            />
          ) : null}
        </View>
      </View>
    );
  },
  (prev, next) => {
    if (prev.item.feedKey !== next.item.feedKey) return false;
    if (prev.pageHeight !== next.pageHeight) return false;
    const prevVis = prev.itemIndex === prev.visibleIndex;
    const nextVis = next.itemIndex === next.visibleIndex;
    if (prev.visibleIndex !== next.visibleIndex && (prevVis !== nextVis || prev.item.kind === "MCQ" || next.item.kind === "MCQ")) {
      return false;
    }
    if (next.item.kind === "MCQ" && nextVis) {
      if (prev.mcqTimeLeft !== next.mcqTimeLeft || prev.mcqPaused !== next.mcqPaused) return false;
    }
    return true;
  },
);

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    topBarSlot: {
      minHeight: 64,
      justifyContent: "center",
      backgroundColor: colors.bg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      paddingHorizontal: 14,
      paddingBottom: 10,
    },
    topBarPlaceholder: { minHeight: 44 },
    mcqBarInner: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
    mcqBarSpacer: { width: 40 },
    mcqTimerCol: { alignItems: "center", flex: 1 },
    mcqTimerText: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
    },
    mcqSub: { color: colors.muted, fontSize: 12, fontWeight: "600", marginTop: 2 },
    body: { flex: 1, paddingHorizontal: 16, paddingBottom: 8 },
    flex1: { flex: 1 },
    listWrap: { flex: 1, minHeight: 0 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    muted: { color: colors.muted, marginTop: 12, textAlign: "center" },
    errorText: { color: colors.muted, textAlign: "center", marginBottom: 16, lineHeight: 22 },
    page: { paddingHorizontal: 0 },
    metaText: {
      color: colors.muted,
      fontSize: 12,
      lineHeight: 17,
      marginBottom: 10,
      paddingTop: 15,
    },
    cardWrap: { flex: 1, minHeight: 0 },
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
    infoText: { textAlign: "left", alignSelf: "stretch", width: "100%" },
    cardTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 14,
      lineHeight: 28,
    },
    cardBody: { color: colors.text, fontSize: 16, lineHeight: 24 },
    actions: { gap: 10, paddingVertical: 12 },
    primaryBtn: {
      backgroundColor: colors.accent,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    primaryBtnText: { color: colors.onAccent, fontWeight: "700", fontSize: 16 },
  });
}

export default function RandomScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const navigation = useNavigation<BottomTabNavigationProp<ParamListBase>>();
  const [items, setItems] = useState<RandomFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [pageHeight, setPageHeight] = useState<number | null>(null);
  const [mcqTimeLeft, setMcqTimeLeft] = useState(MCQ_SECONDS);
  const [mcqPaused, setMcqPaused] = useState(false);
  const loadRunRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appendInFlightRef = useRef(false);

  const appendOne = useCallback(async (): Promise<boolean> => {
    if (appendInFlightRef.current) return false;
    appendInFlightRef.current = true;
    try {
      const r = await pickRandomStudyCard();
      if (!r) return false;
      setItems((prev) => [...prev, { ...r, feedKey: makeFeedKey() }]);
      return true;
    } finally {
      appendInFlightRef.current = false;
    }
  }, []);

  const loadFeed = useCallback(async () => {
    setError(null);
    setLoading(true);
    setItems([]);
    setVisibleIndex(0);
    setPageHeight(null);
    setMcqTimeLeft(MCQ_SECONDS);
    setMcqPaused(false);
    try {
      const acc: RandomFeedItem[] = [];
      for (let a = 0; a < MAX_PICK_ATTEMPTS && acc.length < MIN_INITIAL_CARDS; a++) {
        const r = await pickRandomStudyCard();
        if (r) acc.push({ ...r, feedKey: makeFeedKey() });
      }
      if (acc.length === 0) {
        setError("Uygun kart bulunamadı. Veritabanında içerik olduğundan emin olun.");
        return;
      }
      setItems(acc);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleLoad = useCallback(() => {
    if (loadRunRef.current) clearTimeout(loadRunRef.current);
    loadRunRef.current = setTimeout(() => {
      loadRunRef.current = null;
      void loadFeed();
    }, 60);
  }, [loadFeed]);

  useFocusEffect(
    useCallback(() => {
      scheduleLoad();
      return () => {
        if (loadRunRef.current) {
          clearTimeout(loadRunRef.current);
          loadRunRef.current = null;
        }
      };
    }, [scheduleLoad]),
  );

  useEffect(() => {
    const unsub = navigation.addListener("tabPress", () => {
      scheduleLoad();
    });
    return unsub;
  }, [navigation, scheduleLoad]);

  const active = items[visibleIndex];

  useEffect(() => {
    if (!active || active.kind !== "MCQ") return;
    setMcqTimeLeft(MCQ_SECONDS);
    setMcqPaused(false);
  }, [active?.card.id, active?.kind, visibleIndex]);

  useEffect(() => {
    if (!active || active.kind !== "MCQ" || mcqPaused) return;
    const id = setInterval(() => {
      setMcqTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [active?.kind, active?.card.id, mcqPaused, visibleIndex]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setVisibleIndex(viewableItems[0].index);
    }
  }, []);

  useEffect(() => {
    if (loading || items.length === 0) return;
    if (items.length <= PREFETCH_AHEAD) return;
    if (visibleIndex < items.length - PREFETCH_AHEAD) return;
    void appendOne();
  }, [visibleIndex, items.length, loading, appendOne]);

  const viewConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 80,
  }).current;

  const onListLayout = useCallback((e: LayoutChangeEvent) => {
    const next = e.nativeEvent.layout.height;
    if (next > 0) setPageHeight((prev) => (prev == null ? next : prev));
  }, []);

  const openSubtopic = () => {
    if (active) router.push(`/subtopic/${active.subtopicId}`);
  };

  const h = pageHeight ?? 400;
  const showMcqTimer = active?.kind === "MCQ";

  const renderRow = useCallback(
    ({ item, index: itemIndex }: { item: RandomFeedItem; index: number }) => (
      <RandomFeedRow
        item={item}
        itemIndex={itemIndex}
        pageHeight={h}
        visibleIndex={visibleIndex}
        mcqTimeLeft={mcqTimeLeft}
        mcqPaused={mcqPaused}
        onMcqAnswer={() => setMcqPaused(true)}
        styles={styles}
      />
    ),
    [h, visibleIndex, mcqTimeLeft, mcqPaused, styles],
  );

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "top"]}>
      <View style={styles.topBarSlot}>
        {showMcqTimer ? (
          <View style={styles.mcqBarInner}>
            <View style={styles.mcqBarSpacer} />
            <View style={styles.mcqTimerCol}>
              <Text style={styles.mcqTimerText}>{formatMcqTime(mcqTimeLeft)}</Text>
              <Text style={styles.mcqSub}>Kalan soru: 1</Text>
            </View>
            <View style={styles.mcqBarSpacer} />
          </View>
        ) : (
          <View style={styles.topBarPlaceholder} />
        )}
      </View>

      <View style={styles.body}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.muted}>Rastgele kartlar yükleniyor…</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.primaryBtn} onPress={() => void loadFeed()}>
              <Text style={styles.primaryBtnText}>Tekrar dene</Text>
            </Pressable>
          </View>
        ) : items.length > 0 ? (
          <>
            <View style={styles.listWrap} onLayout={onListLayout}>
              {pageHeight != null ? (
                <FlatList
                  data={items}
                  keyExtractor={(item) => item.feedKey}
                  pagingEnabled
                  nestedScrollEnabled
                  removeClippedSubviews={false}
                  windowSize={5}
                  showsVerticalScrollIndicator={false}
                  onViewableItemsChanged={onViewableItemsChanged}
                  viewabilityConfig={viewConfig}
                  extraData={{ visibleIndex, itemCount: items.length }}
                  getItemLayout={(_, index) => ({
                    length: h,
                    offset: h * index,
                    index,
                  })}
                  renderItem={renderRow}
                />
              ) : (
                <View style={styles.flex1} />
              )}
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.primaryBtn} onPress={openSubtopic}>
                <Text style={styles.primaryBtnText}>Bu konuya git</Text>
              </Pressable>
            </View>
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
