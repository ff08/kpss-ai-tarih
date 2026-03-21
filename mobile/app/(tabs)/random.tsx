import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
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
import type { CardKind } from "../../lib/api";
import { pickRandomStudyCard, type RandomPickResult } from "../../lib/pickRandomStudyCard";

const MCQ_SECONDS = 60;

function formatMcqTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

const KIND_LABELS: Record<CardKind, string> = {
  INFORMATION: "Bilgi kartı",
  OPEN_QA: "Soru–cevap",
  MCQ: "Çoktan seçmeli",
};

export default function RandomScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const navigation = useNavigation<BottomTabNavigationProp<ParamListBase>>();
  const [pick, setPick] = useState<RandomPickResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mcqTimeLeft, setMcqTimeLeft] = useState(MCQ_SECONDS);
  const [mcqPaused, setMcqPaused] = useState(false);
  const loadRunRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    setPick(null);
    setMcqTimeLeft(MCQ_SECONDS);
    setMcqPaused(false);
    try {
      const r = await pickRandomStudyCard();
      if (!r) {
        setError("Uygun kart bulunamadı. Veritabanında içerik olduğundan emin olun.");
        setPick(null);
      } else {
        setPick(r);
      }
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
      void load();
    }, 60);
  }, [load]);

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

  useEffect(() => {
    if (!pick || pick.kind !== "MCQ") return;
    setMcqTimeLeft(MCQ_SECONDS);
    setMcqPaused(false);
  }, [pick?.card.id, pick?.kind]);

  useEffect(() => {
    if (!pick || pick.kind !== "MCQ" || mcqPaused) return;
    const id = setInterval(() => {
      setMcqTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [pick?.kind, pick?.card.id, mcqPaused]);

  const openSubtopic = () => {
    if (pick) router.push(`/subtopic/${pick.subtopicId}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "top"]}>
      {pick?.kind === "MCQ" ? (
        <View style={styles.mcqBar}>
          <View style={styles.mcqBarInner}>
            <View style={styles.mcqBarSpacer} />
            <View style={styles.mcqTimerCol}>
              <Text style={styles.mcqTimerText}>{formatMcqTime(mcqTimeLeft)}</Text>
              <Text style={styles.mcqSub}>Kalan soru: 1</Text>
            </View>
            <View style={styles.mcqBarSpacer} />
          </View>
        </View>
      ) : null}

      <View style={styles.body}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.muted}>Rastgele kart seçiliyor…</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.primaryBtn} onPress={() => void load()}>
              <Text style={styles.primaryBtnText}>Tekrar dene</Text>
            </Pressable>
          </View>
        ) : pick ? (
          <>
            <View style={styles.metaRow}>
              <View style={styles.kindPill}>
                <Text style={styles.kindPillText}>{KIND_LABELS[pick.kind]}</Text>
              </View>
              <Text style={styles.metaText} numberOfLines={2}>
                {pick.topicTitle} · {pick.subtopicTitle}
              </Text>
            </View>
            <View style={styles.cardWrap}>
              {pick.kind === "INFORMATION" ? (
                <View style={styles.card}>
                  <ScrollView
                    style={styles.infoScroll}
                    contentContainerStyle={styles.infoScrollContent}
                    showsVerticalScrollIndicator={false}
                  >
                    <Text style={[styles.cardTitle, styles.infoText]}>{pick.card.title}</Text>
                    <MdText style={[styles.cardBody, styles.infoText]}>{pick.card.content}</MdText>
                  </ScrollView>
                </View>
              ) : null}
              {pick.kind === "OPEN_QA" ? (
                <FlipQaCard
                  question={pick.card.title}
                  answer={pick.card.content}
                  resetKey={pick.card.id}
                  hint={pick.card.hint}
                />
              ) : null}
              {pick.kind === "MCQ" ? (
                <McqSlide
                  item={pick.card}
                  isActive
                  timeUp={mcqTimeLeft === 0}
                  onAnswer={() => setMcqPaused(true)}
                />
              ) : null}
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

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    mcqBar: {
      backgroundColor: colors.bg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      paddingBottom: 10,
      paddingHorizontal: 14,
    },
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
    centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    muted: { color: colors.muted, marginTop: 12, textAlign: "center" },
    errorText: { color: colors.muted, textAlign: "center", marginBottom: 16, lineHeight: 22 },
    metaRow: { marginBottom: 10, gap: 6 },
    kindPill: {
      alignSelf: "flex-start",
      backgroundColor: colors.tagBg,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    kindPillText: { color: colors.accent, fontSize: 11, fontWeight: "700" },
    metaText: { color: colors.muted, fontSize: 12, lineHeight: 17 },
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
