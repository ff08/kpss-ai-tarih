import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import type { CatalogExamCalendarItem } from "../../lib/api";
import { fetchCatalogExamCalendar } from "../../lib/api";
import type { ColorPalette } from "../../constants/theme";
import { APP_TAGLINE } from "../../constants/app";
import { useTheme } from "../../contexts/ThemeContext";
import { getCountdownTo, formatTrDate } from "../../lib/examCountdown";

type FilterMode = "all" | "active" | "inactive";

export default function ExamsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [items, setItems] = useState<CatalogExamCalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const [filter, setFilter] = useState<FilterMode>("all");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        setLoading(true);
        const rows = await fetchCatalogExamCalendar();
        if (cancelled) return;
        setItems(rows);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const nowDate = useMemo(() => new Date(now), [now]);

  const filtered = useMemo(() => {
    const base = items.filter((it) => {
      if (filter === "all") return true;
      if (filter === "active") return it.isActive;
      return !it.isActive;
    });

    return base.sort((a, b) => a.examDate.localeCompare(b.examDate));
  }, [items, filter]);

  const nextExamForHero = useMemo(() => {
    const nowMs = nowDate.getTime();
    return items
      .filter((it) => it.isActive)
      .map((it) => ({ it, deadlineMs: new Date(it.applicationDeadline).getTime() }))
      .filter(({ deadlineMs }) => Number.isFinite(deadlineMs) && deadlineMs > nowMs)
      .sort((a, b) => a.deadlineMs - b.deadlineMs)[0]?.it;
  }, [items, nowDate]);

  const heroCountdown = useMemo(() => {
    if (!nextExamForHero) return null;
    const deadline = new Date(nextExamForHero.applicationDeadline);
    return getCountdownTo(deadline, nowDate);
  }, [nextExamForHero, nowDate]);

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

      {loading ? (
        <View style={styles.centered}>
          <Text style={styles.muted}>Yükleniyor…</Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.hero}>
              <Text style={styles.heroLabel}>Başvuruya kalan süre</Text>

              {nextExamForHero && heroCountdown && !heroCountdown.passed ? (
                <>
                  <Text style={styles.heroExamTitle} numberOfLines={3}>
                    {nextExamForHero.title}
                  </Text>
                  <Text style={styles.heroExamDate}>{formatTrDate(nextExamForHero.applicationDeadline)}</Text>
                  <View style={styles.heroDigits}>
                    <DigitBox label="Gün" value={heroCountdown.days} colors={colors} />
                    <DigitBox label="Saat" value={heroCountdown.hours} colors={colors} />
                    <DigitBox label="Dk" value={heroCountdown.minutes} colors={colors} />
                    <DigitBox label="Sn" value={heroCountdown.seconds} colors={colors} />
                  </View>
                </>
              ) : (
                <Text style={styles.heroEmpty}>
                  Aktif ve başvurusu devam eden sınav bulunmuyor.
                </Text>
              )}
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              {filter === "all"
                ? "Kayıt yok."
                : filter === "active"
                  ? "Aktif sınav yok."
                  : "Pasif sınav yok."}
            </Text>
          }
          renderItem={({ item }) => <ExamRow exam={item} now={nowDate} colors={colors} />}
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

function StatusPill({ isActive, colors }: { isActive: boolean; colors: ColorPalette }) {
  return (
    <View
      style={[
        stylesLocal.statusPill,
        isActive ? { backgroundColor: colors.tagBg, borderColor: colors.accent } : { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[stylesLocal.statusText, isActive ? { color: colors.accent } : { color: colors.muted }]}>
        {isActive ? "Aktif" : "Pasif"}
      </Text>
    </View>
  );
}

const stylesLocal = StyleSheet.create({
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: "flex-start",
  },
  statusText: { fontSize: 12, fontWeight: "700" },
});

function ExamRow({
  exam,
  now,
  colors,
}: {
  exam: CatalogExamCalendarItem;
  now: Date;
  colors: ColorPalette;
}) {
  const styles = useMemo(() => createStyles(colors), [colors]);

  const deadline = new Date(exam.applicationDeadline);
  const cd = getCountdownTo(deadline, now);

  const examDateLabel = formatTrDate(exam.examDate);

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardText}>
          <StatusPill isActive={exam.isActive} colors={colors} />
          <Text style={styles.examTitle}>{exam.title}</Text>
          <Text style={styles.examDate}>{examDateLabel}</Text>
          {exam.description ? (
            <Text style={styles.examDesc} numberOfLines={3}>
              {exam.description}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rowCountdown}>
        <Text style={styles.cdLabel}>Başvuruya kalan süre</Text>
        <Text style={styles.cdValue}>
          {cd.passed
            ? "Başvuru tarihi geçti"
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
    examTitle: { color: colors.text, fontSize: 15, fontWeight: "700", lineHeight: 21, marginTop: 8 },
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

