import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { KPSS_EXAMS, type ExamRecord } from "../../constants/exams";
import type { ColorPalette } from "../../constants/theme";
import { APP_TAGLINE } from "../../constants/app";
import { useTheme } from "../../contexts/ThemeContext";
import { getCountdownTo, examTargetDate, formatTrDate, nextUpcomingExam } from "../../lib/examCountdown";
import {
  isExamActive,
  loadExamActivePrefs,
  saveExamActivePrefs,
  type ExamActivePrefs,
} from "../../lib/examPreferences";

type FilterMode = "all" | "active" | "inactive";

export default function ExamsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [prefs, setPrefs] = useState<ExamActivePrefs>({});
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [filter, setFilter] = useState<FilterMode>("all");

  useEffect(() => {
    void loadExamActivePrefs().then((p) => {
      setPrefs(p);
      setLoaded(true);
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
        delete next[id];
      } else {
        next[id] = false;
      }
      void saveExamActivePrefs(next);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    return KPSS_EXAMS.filter((e) => {
      const a = isExamActive(e.id, prefs);
      if (filter === "all") return true;
      if (filter === "active") return a;
      return !a;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [prefs, filter]);

  const nextExam = useMemo(
    () => nextUpcomingExam(KPSS_EXAMS, prefs, nowDate),
    [prefs, nowDate],
  );

  const heroCountdown = useMemo(() => {
    if (!nextExam) return null;
    const target = examTargetDate(nextExam.date);
    return getCountdownTo(target, nowDate);
  }, [nextExam, nowDate]);

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <ScreenHeader title="Sınavlar" tagline={APP_TAGLINE} />
      <View style={styles.filterRow}>
        {(
          [
            { key: "all" as const, label: "Tümü" },
            { key: "active" as const, label: "Aktif" },
            { key: "inactive" as const, label: "Pasif" },
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

      {loaded ? (
        <FlatList
          style={styles.list}
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.hero}>
              <Text style={styles.heroLabel}>Sınava kalan süre</Text>
              {nextExam && heroCountdown && !heroCountdown.passed ? (
                <>
                  <Text style={styles.heroExamTitle} numberOfLines={3}>
                    {nextExam.title}
                  </Text>
                  <Text style={styles.heroExamDate}>{formatTrDate(nextExam.date)}</Text>
                  <View style={styles.heroDigits}>
                    <DigitBox label="Gün" value={heroCountdown.days} colors={colors} />
                    <DigitBox label="Saat" value={heroCountdown.hours} colors={colors} />
                    <DigitBox label="Dk" value={heroCountdown.minutes} colors={colors} />
                    <DigitBox label="Sn" value={heroCountdown.seconds} colors={colors} />
                  </View>
                </>
              ) : (
                <Text style={styles.heroEmpty}>
                  Takip ettiğiniz ve tarihi gelmemiş sınav bulunmuyor. Tüm sınavları aktif bırakın veya
                  filtreleri kontrol edin.
                </Text>
              )}
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              {filter === "all"
                ? "Kayıt yok."
                : filter === "active"
                  ? "Aktif sınav yok. Listeden sınavları açarak takip edebilirsiniz."
                  : "Pasif sınav yok."}
            </Text>
          }
          renderItem={({ item }) => (
            <ExamRow
              exam={item}
              active={isExamActive(item.id, prefs)}
              onToggle={(on) => void setActive(item.id, on)}
              now={nowDate}
              colors={colors}
            />
          )}
        />
      ) : (
        <View style={styles.centered}>
          <Text style={styles.muted}>Yükleniyor…</Text>
        </View>
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
  active,
  onToggle,
  now,
  colors,
}: {
  exam: ExamRecord;
  active: boolean;
  onToggle: (on: boolean) => void;
  now: Date;
  colors: ColorPalette;
}) {
  const styles = useMemo(() => createStyles(colors), [colors]);
  const target = examTargetDate(exam.date);
  const cd = getCountdownTo(target, now);
  const dateLabel = formatTrDate(exam.date);

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardText}>
          <Text style={styles.group}>{exam.groupLabel}</Text>
          <Text style={styles.examTitle}>{exam.title}</Text>
          <Text style={styles.examDate}>{dateLabel}</Text>
        </View>
        <Switch
          value={active}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={colors.card}
          ios_backgroundColor={colors.border}
          accessibilityLabel="Sınavı takip et"
        />
      </View>
      <View style={styles.rowCountdown}>
        <Text style={styles.cdLabel}>Kalan süre</Text>
        <Text style={styles.cdValue}>
          {cd.passed
            ? "Sınav tarihi geçti"
            : `${cd.days} gün ${cd.hours} sa ${cd.minutes} dk ${cd.seconds} sn`}
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
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    muted: { color: colors.muted },
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
    group: { color: colors.muted, fontSize: 12, marginBottom: 4 },
    examTitle: { color: colors.text, fontSize: 15, fontWeight: "600", lineHeight: 21 },
    examDate: { color: colors.accent, fontSize: 13, fontWeight: "600", marginTop: 6 },
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
