import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  fetchCards,
  parseWordGamePayload,
  fetchSubtopicMeta,
  submitContentIssueReport,
  type CardKind,
  type ContentIssueCategory,
  type StudyCard,
} from "../../lib/api";
import { CardReportButton } from "../../components/CardReportButton";
import { ContentIssueReportModal } from "../../components/ContentIssueReportModal";
import { MdText } from "../../components/MdText";
import { FlipQaCard } from "../../components/FlipQaCard";
import { McqSlide } from "../../components/McqSlide";
import { WordGameCard } from "../../components/WordGameCard";
import { ProgressRing } from "../../components/ProgressRing";
import { ScreenHeader } from "../../components/ScreenHeader";
import { StudyModePath } from "../../components/StudyModePath";
import { APP_TAGLINE } from "../../constants/app";
import type { ColorPalette } from "../../constants/theme";
import { useStudyProgress } from "../../contexts/StudyProgressContext";
import { useTheme } from "../../contexts/ThemeContext";
import { loadReportedKeySet, markCardReported, reportKey } from "../../lib/contentReportCache";
import { getMcqAnswerFromMap, loadMcqAnswers, saveMcqAnswer, type McqAnswerMap } from "../../lib/mcqAnswerCache";
import { getReporterClientId } from "../../lib/reporterClientId";
import {
  buildStudyPathSteps,
  getResumeIndexForMode,
  getStudyPathStepStates,
  type SubtopicContentCounts,
} from "../../lib/studyProgress";

const MODE_LABELS: Record<CardKind, string> = {
  INFORMATION: "Bilgi Kartı",
  OPEN_QA: "Soru - Cevap",
  MCQ: "Çoktan Seçmeli",
  WORD_GAME: "Kelime Bulmaca",
};
const EMPTY_MODE_COUNTS: Record<CardKind, number> = {
  INFORMATION: 0,
  OPEN_QA: 0,
  MCQ: 0,
  WORD_GAME: 0,
};

const MCQ_SECONDS_PER_QUESTION = 60;
const WORD_GAME_DUMMY_CARDS: StudyCard[] = [
  {
    id: "wg-dummy-1",
    kind: "WORD_GAME",
    difficulty: null,
    title: "Osmanli Devleti'nin yonetim merkezinin adi nedir?",
    content: JSON.stringify({ answer: "PAYITAHT", shuffledLetters: ["T", "H", "Y", "A", "T", "I", "P", "A"] }),
    tag: "Dummy",
    hint: "Baskent anlaminda kullanilir",
  },
  {
    id: "wg-dummy-2",
    kind: "WORD_GAME",
    difficulty: null,
    title: "Tarihte olaylari zaman sirasina koyma yontemi nedir?",
    content: JSON.stringify({ answer: "KRONOLOJI", shuffledLetters: ["J", "R", "O", "K", "N", "O", "L", "O", "I"] }),
    tag: "Dummy",
    hint: "Zaman bilimi ile ilgilidir",
  },
  {
    id: "wg-dummy-3",
    kind: "WORD_GAME",
    difficulty: null,
    title: "Kaynaklarin guvenilirligini inceleme islemine ne denir?",
    content: JSON.stringify({ answer: "TENKIT", shuffledLetters: ["K", "I", "T", "T", "N", "E"] }),
    tag: "Dummy",
    hint: "Kaynak elestirisi",
  },
];

function toRouteParamNumber(v: string | string[] | undefined): number {
  const raw = Array.isArray(v) ? v[0] : v;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function formatMcqTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function tryParseWordGamePayload(content: string): { answer: string; shuffledLetters: string[] } | null {
  try {
    return parseWordGamePayload(content);
  } catch {
    return null;
  }
}

const CARD_KIND_PARAMS: CardKind[] = ["INFORMATION", "OPEN_QA", "MCQ", "WORD_GAME"];

function parseInitialModeParam(v: string | string[] | undefined): CardKind | null {
  const raw = Array.isArray(v) ? v[0] : v;
  if (!raw || typeof raw !== "string") return null;
  return CARD_KIND_PARAMS.includes(raw as CardKind) ? (raw as CardKind) : null;
}

export default function CardDeckScreen() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const { colors } = useTheme();
  const { recordScroll, getSubtopic, getOverall, progress } = useStudyProgress();
  const styles = useMemo(() => createSubtopicStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const {
    subtopicId,
    topicTitle: topicTitleParam,
    subtopicTitle: subtopicTitleParam,
    informationCount,
    openQaCount,
    wordGameCount,
    mcqCount,
    initialMode: initialModeParam,
    fromTopic: fromTopicParam,
  } = useLocalSearchParams<{
    subtopicId: string;
    topicTitle?: string;
    subtopicTitle?: string;
    informationCount?: string;
    openQaCount?: string;
    wordGameCount?: string;
    mcqCount?: string;
    initialMode?: string;
    fromTopic?: string;
  }>();
  const initialModeParsed = useMemo(() => parseInitialModeParam(initialModeParam), [initialModeParam]);
  const fromTopicFlow = useMemo(() => {
    const raw = Array.isArray(fromTopicParam) ? fromTopicParam[0] : fromTopicParam;
    return raw === "1" || raw === "true";
  }, [fromTopicParam]);
  const subtopicIdNum = useMemo(() => {
    const n = Number(subtopicId);
    return Number.isFinite(n) ? n : NaN;
  }, [subtopicId]);
  const routeTopicTitle = useMemo(
    () => (Array.isArray(topicTitleParam) ? topicTitleParam[0] : topicTitleParam) ?? "",
    [topicTitleParam],
  );
  const routeSubtopicTitle = useMemo(
    () => (Array.isArray(subtopicTitleParam) ? subtopicTitleParam[0] : subtopicTitleParam) ?? "",
    [subtopicTitleParam],
  );
  const routeModeCounts = useMemo<Record<CardKind, number>>(
    () => ({
      INFORMATION: toRouteParamNumber(informationCount),
      OPEN_QA: toRouteParamNumber(openQaCount),
      WORD_GAME: toRouteParamNumber(wordGameCount),
      MCQ: toRouteParamNumber(mcqCount),
    }),
    [informationCount, openQaCount, wordGameCount, mcqCount],
  );
  const routeModeCountsTotal = useMemo(
    () =>
      routeModeCounts.INFORMATION +
      routeModeCounts.OPEN_QA +
      routeModeCounts.WORD_GAME +
      routeModeCounts.MCQ,
    [routeModeCounts],
  );
  const [topicTitle, setTopicTitle] = useState(routeTopicTitle);
  const [subTitle, setSubTitle] = useState(routeSubtopicTitle);
  const [subtopicDescription, setSubtopicDescription] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<number | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportCard, setReportCard] = useState<StudyCard | null>(null);
  const [mode, setMode] = useState<CardKind | null>(null);
  const [modeCounts, setModeCounts] = useState<Record<CardKind, number>>(routeModeCounts);
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
  const saveScrollDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [deckEpoch, setDeckEpoch] = useState(0);
  const [reportedKeySet, setReportedKeySet] = useState<Set<string>>(() => new Set());
  const [mcqAnswers, setMcqAnswers] = useState<McqAnswerMap>({});
  const getSubtopicRef = useRef(getSubtopic);
  const indexRef = useRef(0);
  const modeRef = useRef<CardKind | null>(null);
  const cardsLenRef = useRef(0);

  useEffect(() => {
    getSubtopicRef.current = getSubtopic;
  }, [getSubtopic]);

  useEffect(() => {
    setTopicTitle(routeTopicTitle);
    setSubTitle(routeSubtopicTitle);
    setModeCounts(routeModeCounts);
  }, [subtopicId, routeTopicTitle, routeSubtopicTitle, routeModeCounts]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    cardsLenRef.current = cards.length;
  }, [cards.length]);

  useEffect(() => {
    let cancelled = false;
    void loadReportedKeySet().then((set) => {
      if (!cancelled) setReportedKeySet(set);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void loadMcqAnswers().then((map) => {
      if (!cancelled) setMcqAnswers(map);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        const m = modeRef.current;
        const sid = subtopicIdNum;
        if (!m || !Number.isFinite(sid) || cardsLenRef.current === 0) return;
        void recordScroll(sid, m, indexRef.current, cardsLenRef.current);
      };
    }, [recordScroll, subtopicIdNum]),
  );

  const reloadMeta = useCallback(async () => {
    if (!subtopicId) return;
    setMetaLoading(true);
    setError(null);
    setSubtopicDescription(null);
    try {
      const m = await fetchSubtopicMeta(subtopicId);
      setTopicTitle(m.topicTitle);
      setSubTitle(m.title);
      setTopicId(m.topicId);
      const d = m.description?.trim();
      setSubtopicDescription(d ? d : null);
      const nextCounts: Record<CardKind, number> = {
        INFORMATION: m.informationCount ?? 0,
        OPEN_QA: m.openQaCount ?? 0,
        WORD_GAME: m.wordGameCount ?? 0,
        MCQ: m.mcqCount ?? 0,
      };
      setModeCounts((prev) => {
        const prevTotal = prev.INFORMATION + prev.OPEN_QA + prev.WORD_GAME + prev.MCQ;
        const nextTotal =
          nextCounts.INFORMATION + nextCounts.OPEN_QA + nextCounts.WORD_GAME + nextCounts.MCQ;
        // Eğer API geçici olarak 0 dönerse, listeden gelen ilk dolu değerleri koru.
        if (routeModeCountsTotal > 0 && prevTotal > 0 && nextTotal === 0) return prev;
        return nextCounts;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setMetaLoading(false);
    }
  }, [subtopicId, routeModeCountsTotal]);

  useEffect(() => {
    void reloadMeta();
  }, [reloadMeta]);

  useEffect(() => {
    setMode(initialModeParsed);
  }, [subtopicId, initialModeParsed]);

  const load = useCallback(async () => {
    if (!subtopicId || !mode) return;
    setError(null);
    setLoading(true);
    setCards([]);
    try {
      const data = await fetchCards(subtopicId, mode);
      setTopicTitle(data.topicTitle);
      setSubTitle(data.title);
      setTopicId(data.topicId);
      const nextCards =
        mode === "WORD_GAME" && data.cards.length === 0 ? WORD_GAME_DUMMY_CARDS : data.cards;
      setCards(nextCards);
      setModeCounts((prev) => ({ ...prev, [mode]: nextCards.length }));
      const resume = getResumeIndexForMode(getSubtopicRef.current(subtopicIdNum), mode, nextCards.length);
      setIndex(resume);
      const total = nextCards.length;
      if (total > 0) {
        deckProgressAnim.setValue(Math.min(1, (resume + 1) / total));
      } else {
        deckProgressAnim.setValue(0);
      }
      setDeckEpoch((e) => e + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [subtopicId, mode, subtopicIdNum]);

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
    if (!mode) return;
    if (cards.length === 0) return;
    const total = cards.length;
    const pos = Math.min(index + 1, total);
    const target = pos / total;
    Animated.timing(deckProgressAnim, {
      toValue: target,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [mode, index, cards.length]);

  useEffect(() => {
    if (!mode || cards.length === 0 || !Number.isFinite(subtopicIdNum)) return;
    if (saveScrollDebounceRef.current) clearTimeout(saveScrollDebounceRef.current);
    saveScrollDebounceRef.current = setTimeout(() => {
      void recordScroll(subtopicIdNum, mode, index, cards.length);
    }, 320);
    return () => {
      if (saveScrollDebounceRef.current) clearTimeout(saveScrollDebounceRef.current);
    };
  }, [mode, index, cards.length, subtopicIdNum, recordScroll]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setIndex(viewableItems[0].index);
    }
  }, []);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const ph = pageHeight;
      if (ph == null || ph <= 0) return;
      const y = e.nativeEvent.contentOffset.y;
      const raw = Math.round(y / ph);
      const max = Math.max(0, cards.length - 1);
      const clamped = Math.max(0, Math.min(Number.isFinite(raw) ? raw : 0, max));
      setIndex(clamped);
    },
    [pageHeight, cards.length],
  );

  const viewConfig = useRef({
    itemVisiblePercentThreshold: 35,
    minimumViewTime: 0,
  }).current;

  const onListLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && h !== pageHeight) {
      setPageHeight(h);
    }
  }, [pageHeight]);

  const goToModeMenu = useCallback(() => {
    if (mode && cards.length > 0 && Number.isFinite(subtopicIdNum)) {
      void recordScroll(subtopicIdNum, mode, index, cards.length);
    }
    if (fromTopicFlow && router.canGoBack()) {
      router.back();
      return;
    }
    setMode(null);
  }, [mode, cards.length, subtopicIdNum, index, recordScroll, fromTopicFlow, router]);

  const listExtraData = useMemo(
    () => ({ mode, index, mcqTimeLeft, deckEpoch, reportedKeySet, mcqAnswers }),
    [mode, index, mcqTimeLeft, deckEpoch, reportedKeySet, mcqAnswers],
  );

  const countsForProgress: SubtopicContentCounts = useMemo(
    () => ({
      informationCount: modeCounts.INFORMATION,
      openQaCount: modeCounts.OPEN_QA,
      wordGameCount: modeCounts.WORD_GAME,
      mcqCount: modeCounts.MCQ,
    }),
    [modeCounts],
  );

  const { percentDone, hasContent } = useMemo(() => {
    if (!Number.isFinite(subtopicIdNum)) return { percentDone: 0, hasContent: false };
    return getOverall(subtopicIdNum, countsForProgress);
  }, [getOverall, subtopicIdNum, countsForProgress, progress]);

  const studyPathSteps = useMemo(() => {
    const built = buildStudyPathSteps(countsForProgress);
    return getStudyPathStepStates(
      Number.isFinite(subtopicIdNum) ? getSubtopic(subtopicIdNum) : undefined,
      built,
    );
  }, [countsForProgress, getSubtopic, subtopicIdNum, progress]);

  const studyLevel = useMemo(() => Math.min(5, 1 + Math.floor(percentDone / 25)), [percentDone]);

  const handleMcqSelect = useCallback(
    (cardId: string | number, selectedIndex: number) => {
      if (!Number.isFinite(subtopicIdNum)) return;
      setMcqAnswers((prev) => {
        const next = { ...prev, [`${subtopicIdNum}:${String(cardId)}`]: selectedIndex };
        return next;
      });
      void saveMcqAnswer(subtopicIdNum, cardId, selectedIndex);
    },
    [subtopicIdNum],
  );

  const currentCardReported = useMemo(() => {
    if (!mode || !Number.isFinite(subtopicIdNum) || cards.length === 0) return false;
    const cur = cards[index];
    if (!cur) return false;
    const rowId = Number(cur.id);
    if (!Number.isFinite(rowId)) return false;
    return reportedKeySet.has(reportKey(subtopicIdNum, mode, rowId));
  }, [mode, subtopicIdNum, cards, index, reportedKeySet]);

  const initialScrollIndex = useMemo(() => {
    if (cards.length === 0) return 0;
    return Math.min(Math.max(0, index), cards.length - 1);
  }, [cards.length, index]);

  const submitIssueReport = useCallback(
    async (category: ContentIssueCategory, note: string) => {
      if (!mode || topicId == null || !Number.isFinite(subtopicIdNum) || !reportCard) {
        throw new Error("Oturum bilgisi eksik");
      }
      const rowId = Number(reportCard.id);
      if (!Number.isFinite(rowId)) {
        throw new Error("Geçersiz kart");
      }
      const cacheKey = reportKey(subtopicIdNum, mode, rowId);
      const reporterClientId = await getReporterClientId();
      try {
        await submitContentIssueReport({
          topicId,
          subtopicId: subtopicIdNum,
          datasetKind: mode,
          contentRowId: rowId,
          category,
          reporterClientId,
          note: note || undefined,
          topicTitleSnapshot: topicTitle,
          subtopicTitleSnapshot: subTitle,
          cardTitleSnapshot: reportCard.title,
        });
        await markCardReported(cacheKey);
        setReportedKeySet((prev) => new Set(prev).add(cacheKey));
        Alert.alert("Teşekkürler", "Bildiriminiz kaydedildi.");
      } catch (e) {
        const err = e as Error & { status?: number };
        if (err.status === 409) {
          await markCardReported(cacheKey);
          setReportedKeySet((prev) => new Set(prev).add(cacheKey));
          Alert.alert("Bilgi", err.message || "Bu kart için zaten bildirim gönderdiniz.");
          return;
        }
        throw e;
      }
    },
    [mode, topicId, subtopicIdNum, reportCard, topicTitle, subTitle],
  );

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
        <ScrollView
          style={styles.pathScroll}
          contentContainerStyle={styles.pathScrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={metaLoading} onRefresh={() => void reloadMeta()} tintColor={colors.accent} />
          }
        >
          <View style={styles.masteryCard}>
            <Text style={styles.masteryEyebrow}>KONU VE USTALIK</Text>
            <View style={styles.masteryRow}>
              <View style={styles.masteryTextCol}>
                <Text style={styles.masteryTitle} numberOfLines={3}>
                  {subTitle || "Alt konu"}
                </Text>
                {topicTitle ? (
                  <Text style={styles.masteryTopic} numberOfLines={2}>
                    {topicTitle}
                  </Text>
                ) : null}
                {subtopicDescription ? (
                  <Text style={styles.masteryDesc}>{subtopicDescription}</Text>
                ) : null}
              </View>
              {hasContent ? (
                <ProgressRing percent={percentDone} size={72} strokeWidth={5} colors={colors} />
              ) : (
                <View style={[styles.masteryRingPlaceholder, { borderColor: colors.border }]}>
                  <Text style={[styles.masteryRingDash, { color: colors.muted }]}>—</Text>
                </View>
              )}
            </View>
            <View style={[styles.levelPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.levelPillText, { color: colors.muted }]}>{studyLevel}. seviye</Text>
            </View>
          </View>

          {studyPathSteps.length === 0 ? (
            <View style={[styles.emptyPath, styles.pathBlockAfterMastery]}>
              <Text style={styles.emptyPathTitle}>Bu alt konuda henüz kart yok</Text>
              <Text style={styles.emptyPathSub}>İçerik eklendiğinde çalışma yolu burada görünecek.</Text>
            </View>
          ) : (
            <View style={styles.pathBlockAfterMastery}>
              <StudyModePath
                width={windowWidth}
                steps={studyPathSteps}
                colors={colors}
                onPressStep={({ kind }) => setMode(kind)}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const headerSubtitle = topicTitle && subTitle ? `${topicTitle}\n${subTitle}` : topicTitle || subTitle || "";

  const modLeft = (
    <Pressable onPress={goToModeMenu} hitSlop={12} accessibilityRole="button" accessibilityLabel="Çalışma yoluna dön">
      <Text style={{ color: colors.accent, fontSize: 15, fontWeight: "600" }}>‹ Çalışma yolu</Text>
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
          <Pressable
            style={styles.changeMode}
            onPress={() => {
              setMode(null);
              setError(null);
            }}
          >
            <Text style={styles.changeModeText}>Çalışma yoluna dön</Text>
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
          <Text style={styles.emptySub}>
            {mode === "WORD_GAME"
              ? "Gecici ornek bulmacalar gosteriliyor. Gercek veriler hazir oldugunda otomatik degisecek."
              : `Veritabanında bu alt konu için ${MODE_LABELS[mode]} kaydı bulunmuyor.`}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const h = pageHeight ?? 400;

  const mcqRemaining = index < cards.length ? Math.max(0, cards.length - index) : 0;

  const deckProgressTotal = cards.length;
  const deckProgressPos = Math.min(index + 1, deckProgressTotal);

  const headerReportButton =
    topicId != null && Number.isFinite(subtopicIdNum) && mode && cards.length > 0 && !currentCardReported ? (
      <CardReportButton
        variant="header"
        onPress={() => {
          const cur = cards[index];
          if (cur) {
            setReportCard(cur);
            setReportOpen(true);
          }
        }}
      />
    ) : (
      <View style={styles.mcqBarSpacer} />
    );

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      {mode === "MCQ" ? (
        <View style={[styles.mcqFocusBar, { paddingTop: insets.top + 14 }]}>
          <View style={styles.mcqFocusRow}>
            <Pressable
              onPress={goToModeMenu}
              style={styles.mcqModBtn}
              accessibilityRole="button"
              accessibilityLabel="Çalışma yoluna dön"
            >
              <Text style={styles.mcqModBtnText}>‹ Yol</Text>
            </Pressable>
            <View style={styles.mcqTimerCol}>
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
                {deckProgressPos} / {deckProgressTotal}
              </Text>
              <Text style={styles.mcqTimerText}>{formatMcqTime(mcqTimeLeft)}</Text>
              <Text style={styles.mcqRemainingSub}>Kalan soru: {mcqRemaining}</Text>
            </View>
            {headerReportButton}
          </View>
        </View>
      ) : (
        <View style={[styles.mcqFocusBar, { paddingTop: insets.top + 14 }]}>
          <View style={styles.mcqFocusRow}>
            <Pressable
              onPress={goToModeMenu}
              style={styles.mcqModBtn}
              accessibilityRole="button"
              accessibilityLabel="Çalışma yoluna dön"
            >
              <Text style={styles.mcqModBtnText}>‹ Yol</Text>
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
                {deckProgressPos} / {deckProgressTotal}
              </Text>
            </View>
            {headerReportButton}
          </View>
        </View>
      )}
      <View style={styles.listWrap} onLayout={onListLayout}>
        {pageHeight != null ? (
          <FlatList
            key={`${mode}-${String(subtopicId)}-${deckEpoch}`}
            ref={listRef}
            data={cards}
            keyExtractor={(item) => String(item.id)}
            extraData={listExtraData}
            initialScrollIndex={initialScrollIndex}
            initialNumToRender={Math.min(40, Math.max(8, initialScrollIndex + 4))}
            pagingEnabled
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            onMomentumScrollEnd={onMomentumScrollEnd}
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
                    <ScrollView
                      style={styles.infoScroll}
                      contentContainerStyle={styles.infoScrollContent}
                      showsVerticalScrollIndicator={false}
                    >
                      {item.imageUrl ? (
                        <ExpoImage
                          source={{ uri: item.imageUrl }}
                          style={styles.infoImage}
                          contentFit="cover"
                          accessibilityLabel="Kart görseli"
                        />
                      ) : null}
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
                    selected={Number.isFinite(subtopicIdNum) ? getMcqAnswerFromMap(mcqAnswers, subtopicIdNum, item.id) : null}
                    onSelect={(selectedIndex) => handleMcqSelect(item.id, selectedIndex)}
                    onAnswer={() => setMcqPaused(true)}
                  />
                ) : null}
                {mode === "WORD_GAME" ? (
                  (() => {
                    const payload = tryParseWordGamePayload(item.content);
                    if (!payload) {
                      return <Text style={styles.error}>Kelime oyunu kart verisi gecersiz.</Text>;
                    }
                    return (
                      <WordGameCard
                        question={item.title}
                        answer={payload.answer}
                        shuffledLetters={payload.shuffledLetters}
                        hint={item.hint}
                      />
                    );
                  })()
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
          : mode === "WORD_GAME"
            ? "Harfleri secip kelimeyi tamamlayin"
          : mode === "MCQ"
            ? "Her soru için 1 dk; dikey kaydırarak ilerleyin"
            : "Dikey kaydırarak ileri ve geri gidebilirsiniz"}
      </Text>
      {mode ? (
        <ContentIssueReportModal
          key={reportCard ? String(reportCard.id) : "report"}
          visible={reportOpen}
          onClose={() => {
            setReportOpen(false);
            setReportCard(null);
          }}
          onSubmit={submitIssueReport}
          datasetKind={mode}
          cardTitlePreview={reportCard?.title ?? ""}
        />
      ) : null}
    </SafeAreaView>
  );
}

function createSubtopicStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    pathScroll: { flex: 1 },
    pathScrollContent: { paddingBottom: 36 },
    masteryCard: {
      marginHorizontal: 16,
      marginTop: 8,
      padding: 18,
      borderRadius: 18,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    masteryEyebrow: {
      color: colors.muted,
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1.2,
      marginBottom: 12,
    },
    masteryRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    masteryTextCol: { flex: 1, minWidth: 0 },
    masteryTitle: { color: colors.text, fontSize: 18, fontWeight: "700", lineHeight: 24 },
    masteryTopic: { color: colors.muted, fontSize: 14, marginTop: 6, lineHeight: 20 },
    masteryDesc: {
      color: colors.text,
      fontSize: 14,
      marginTop: 10,
      lineHeight: 21,
      opacity: 0.92,
    },
    masteryRingPlaceholder: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    masteryRingDash: { fontSize: 22, fontWeight: "600" },
    levelPill: {
      alignSelf: "flex-start",
      marginTop: 14,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 999,
      borderWidth: StyleSheet.hairlineWidth,
    },
    levelPillText: { fontSize: 12, fontWeight: "700" },
    pathBlockAfterMastery: {
      marginTop: 20,
    },
    emptyPath: {
      paddingHorizontal: 28,
      paddingVertical: 24,
      marginHorizontal: 16,
      borderRadius: 14,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyPathTitle: { color: colors.text, fontSize: 16, fontWeight: "600", marginBottom: 8 },
    emptyPathSub: { color: colors.muted, fontSize: 14, lineHeight: 20 },
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
      marginTop: 8,
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
    listWrap: { flex: 1, position: "relative" },
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
    infoImage: {
      width: "100%",
      aspectRatio: 4 / 5,
      borderRadius: 12,
      marginBottom: 14,
      backgroundColor: colors.surface,
    },
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
