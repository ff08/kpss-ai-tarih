import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import type { CatalogExamCalendarItem } from "../../lib/api";
import { fetchCatalogExamCalendar } from "../../lib/api";
import type { ColorPalette } from "../../constants/theme";
import { APP_TAGLINE } from "../../constants/app";
import { useTheme } from "../../contexts/ThemeContext";
import { getCountdownTo, examTargetDate, formatTrDate } from "../../lib/examCountdown";
import { isExamActive, loadExamActivePrefs, saveExamActivePrefs, type ExamActivePrefs } from "../../lib/examPreferences";

type FilterMode = "active" | "other";

export default function ExamsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [items, setItems] = useState<CatalogExamCalendarItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [prefs, setPrefs] = useState<ExamActivePrefs>({});
  const [loadedPrefs, setLoadedPrefs] = useState(false);

  const [now, setNow] = useState(() => Date.now());
  const [filter, setFilter] = useState<FilterMode>("active");

  useEffect(() => {
    void (async () => {
      try {
        setLoadingItems(true);
        setError(null);
        const rows = await fetchCatalogExamCalendar();
        setItems(rows);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sınav takvimi alınamadı");
      } finally {
        setLoadingItems(false);
      }
    })();
  }, []);

  useEffect(() => {
    void loadExamActivePrefs().then((p) => {
      setPrefs(p);
      setLoadedPrefs(true);
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const nowDate = useMemo(() => new Date(now), [now]);

  const setActive = useCallback((id: string, active: boolean) => {
    setPrefs((prev) => {
      const next = { ...prev };
      if (active) {
        // aktif ise saklama anahtarını kaldır
        delete next[id];
      } else {
        next[id] = false;
      }
      void saveExamActivePrefs(next);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    // prefs ile “aktif (favori/izlenen)” ve “diğer” ayrımı
    const base = items.filter((it) => {
      const key = String(it.id);
      const a = isExamActive(key, prefs);
      if (filter === "active") return a;
      return !a;
    });
    return base.sort((a, b) => a.examDate.localeCompare(b.examDate));
  }, [items, prefs, filter]);

  const nextExamForHero = useMemo(() => {
    if (!loadedPrefs) return null;
    const active = items.filter((it) => isExamActive(String(it.id), prefs));
    const future = active
      .map((it) => {
        const t = examTargetDate(it.examDate);
        return { it, t };
      })
      .filter(({ t }) => t.getTime() > nowDate.getTime())
      .sort((a, b) => a.t.getTime() - b.t.getTime());
    return future[0]?.it ?? null;
  }, [items, prefs, loadedPrefs, nowDate]);

  const heroCountdown = useMemo(() => {
    if (!nextExamForHero) return null;
    const target = examTargetDate(nextExamForHero.examDate);
    return getCountdownTo(target, nowDate);
  }, [nextExamForHero, nowDate]);

  const heroEmpty =
    filter === "active"
      ? "Aktif sınav bulunmuyor."
      : "Diğer sınavlar listesi boş.";

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <ScreenHeader title="Sınavlar" tagline={APP_TAGLINE} />

      <View style={styles.filterRow}>
        {(
          [
            { key: "active" as const, label: "Aktif Sınavlarım" },
            { key: "other" as const, label: "Diğer" },
          ] as const
        ).map(({ key, label }) => (
          <Pressable
            key={key}
            onPress={() => setFilter(key)}
            style={[styles.filterChip, filter === key && styles.filterChipOn]}
          >
            <Text style={[styles.filterChipText, filter === key && styles.filterChipTextOn]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {loadingItems || !loadedPrefs ? (
        <View style={styles.centered}>
          <Text style={styles.muted}>Yükleniyor…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.hero}>
              <Text style={styles.heroLabel}>Sınava Kalan Süre</Text>
              {nextExamForHero && heroCountdown && !heroCountdown.passed ? (
                <>
                  <Text style={styles.heroExamTitle} numberOfLines={3}>
                    {nextExamForHero.title}
                  </Text>
                  <Text style={styles.heroExamDate}>{formatTrDate(nextExamForHero.examDate)}</Text>
                  <View style={styles.heroDigits}>
                    <DigitBox label="Gün" value={heroCountdown.days} colors={colors} />
                    <DigitBox label="Saat" value={heroCountdown.hours} colors={colors} />
                    <DigitBox label="Dk" value={heroCountdown.minutes} colors={colors} />
                    <DigitBox label="Sn" value={heroCountdown.seconds} colors={colors} />
                  </View>
                </>
              ) : (
                <Text style={styles.heroEmpty}>{heroEmpty}</Text>
              )}
            </View>
          }
          ListEmptyComponent={<Text style={styles.empty}>Kayıt yok.</Text>}
          renderItem={({ item }) => (
            <ExamRow exam={item} now={nowDate} colors={colors} active={isExamActive(String(item.id), prefs)} onToggle={(on) => setActive(String(item.id), on)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function DigitBox({
  label,
  value,
  colors,
}: {
  label: string;
  value: number;
  colors: ColorPalette;
}) {
  return (
    <View style={[digitStyles.box, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Text style={[digitStyles.num, { color: colors.text }]}>{value}</Text>
      <Text style={[digitStyles.lbl, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const digitStyles = StyleSheet.create({
  box: {
    flex: 1,
    minWidth: 72,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  num: { fontSize: 22, fontWeight: "800", fontVariant: ["tabular-nums"] },
  lbl: { fontSize: 11, fontWeight: "600", marginTop: 4 },
});

function ExamRow({
  exam,
  now,
  colors,
  active,
  onToggle,
}: {
  exam: CatalogExamCalendarItem;
  now: Date;
  colors: ColorPalette;
  active: boolean;
  onToggle: (on: boolean) => void;
}) {
  const styles = useMemo(() => createStyles(colors), [colors]);
  const deadline = new Date(exam.applicationDeadline);
  const cd = getCountdownTo(deadline, now);
  const examDateLabel = formatTrDate(exam.examDate);

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardText}>
          <Text style={styles.statusPill}>{exam.isActive ? "Aktif" : "Pasif"}</Text>
          <Text style={styles.examTitle}>{exam.title}</Text>
          <Text style={styles.examDate}>
            Sınav Tarihi: {examDateLabel}
          </Text>
          {exam.description ? (
            <Text style={styles.examDesc} numberOfLines={3}>
              {exam.description}
            </Text>
          ) : null}
        </View>
        <Switch
          value={active}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={colors.card}
          ios_backgroundColor={colors.border}
          accessibilityLabel="Favorilere ekle"
        />
      </View>

      <View style={styles.rowCountdown}>
        <Text style={styles.cdLabel}>Sınav Başvurusuna Kalan Süre</Text>
        <Text style={styles.cdValue}>
          {cd.passed ? "Başvuru tarihi geçti" : `${cd.days} gün ${cd.hours} sa ${cd.minutes} dk ${cd.seconds} sn`}
        </Text>
      </View>
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    filterRow: {
      flexDirection: "row",
      paddingHorizontal: 16,
      marginBottom: 8,
      gap: 8,
    },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    filterChipOn: {
      borderColor: colors.accent,
      backgroundColor: colors.tagBg,
    },
    filterChipText: { color: colors.muted, fontSize: 13, fontWeight: "600" },
    filterChipTextOn: { color: colors.accent },
    list: { flex: 1 },
    listContent: { paddingHorizontal: 16, paddingBottom: 32 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    muted: { color: colors.muted },
    hero: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    heroLabel: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 10,
    },
    heroExamTitle: { color: colors.text, fontSize: 15, fontWeight: "600", lineHeight: 21 },
    heroExamDate: { color: colors.muted, fontSize: 13, marginTop: 6, marginBottom: 14 },
    heroDigits: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
    heroEmpty: { color: colors.muted, fontSize: 14, lineHeight: 21 },
    empty: { color: colors.muted, textAlign: "center", padding: 24 },
    errorText: { color: colors.accent, paddingHorizontal: 24, textAlign: "center", fontSize: 14, lineHeight: 20 },
    card: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
    cardText: { flex: 1, minWidth: 0 },
    statusPill: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: "700",
      marginBottom: 8,
    },
    examTitle: { color: colors.text, fontSize: 15, fontWeight: "700", lineHeight: 21, marginTop: 0 },
    examDate: { color: colors.accent, fontSize: 13, fontWeight: "600", marginTop: 6 },
    examDesc: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 6 },
    rowCountdown: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    cdLabel: { color: colors.muted, fontSize: 12, marginBottom: 4 },
    cdValue: { color: colors.text, fontSize: 14, fontWeight: "600", fontVariant: ["tabular-nums"] },
  });
}

