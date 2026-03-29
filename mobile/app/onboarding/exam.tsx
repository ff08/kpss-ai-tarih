import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingChrome } from "../../components/onboarding/OnboardingChrome";
import { onboardingStyles } from "../../components/onboarding/onboardingStyles";
import {
  DEFAULT_EXAM_SLUG,
  FALLBACK_ACTIVE_EXAMS,
  examSlugToLegacyExamTargetId,
  legacyExamTargetIdToSlug,
} from "../../constants/examCatalog";
import { ONBOARDING_STEP, ONBOARDING_THEME, ONBOARDING_TOTAL_STEPS } from "../../constants/onboardingTheme";
import { fetchCatalogExams } from "../../lib/api";
import { loadOnboardingProfile, saveOnboardingProfile } from "../../lib/onboardingStorage";

type ExamOption = { slug: string; label: string; description?: string | null };

export default function OnboardingExam() {
  const router = useRouter();
  const [options, setOptions] = useState<ExamOption[]>(FALLBACK_ACTIVE_EXAMS);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    void fetchCatalogExams()
      .then((exams) => {
        setOptions(exams.map((e) => ({ slug: e.slug, label: e.label, description: e.description })));
      })
      .catch(() => {
        /* FALLBACK_ACTIVE_EXAMS */
      })
      .finally(() => setCatalogLoading(false));
  }, []);

  useEffect(() => {
    void loadOnboardingProfile().then((p) => {
      if (p?.examSlug) setSelected(p.examSlug);
      else if (p?.examTargetId) setSelected(legacyExamTargetIdToSlug(p.examTargetId));
    });
  }, []);

  const onNext = async () => {
    const slug = selected ?? DEFAULT_EXAM_SLUG;
    const prev =
      (await loadOnboardingProfile()) ??
      ({ displayName: "Öğrenci", examTargetId: "diger" } as const);
    await saveOnboardingProfile({
      displayName: prev.displayName,
      examTargetId: examSlugToLegacyExamTargetId(slug),
      examSlug: slug,
    });
    router.push("/onboarding/auth-choice");
  };

  return (
    <OnboardingChrome
      progress={ONBOARDING_STEP.exam / ONBOARDING_TOTAL_STEPS}
      stepCurrent={ONBOARDING_STEP.exam}
      stepTotal={ONBOARDING_TOTAL_STEPS}
    >
      <View style={styles.flex}>
        <Text style={styles.title}>Hangi sınavın tarih müfredatına çalışıyorsun?</Text>
        <Text style={styles.subtitle}>
          İçerik ve konu listesi seçtiğin sınava göre filtrelenir. İleride yeni sınavlar açılabilir.
        </Text>
        {catalogLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={ONBOARDING_THEME.primary} />
            <Text style={styles.loadingText}>Sınav listesi yükleniyor…</Text>
          </View>
        ) : null}
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {options.map((opt) => {
            const active = selected === opt.slug;
            return (
              <Pressable
                key={opt.slug}
                onPress={() => setSelected(opt.slug)}
                style={({ pressed }) => [
                  styles.option,
                  active && styles.optionActive,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <View style={styles.optionTextWrap}>
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt.label}</Text>
                  {opt.description ? (
                    <Text style={styles.optionDesc} numberOfLines={2}>
                      {opt.description}
                    </Text>
                  ) : null}
                </View>
                {active ? <Ionicons name="checkmark-circle" size={26} color={ONBOARDING_THEME.primary} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable
          style={({ pressed }) => [
            onboardingStyles.primaryBtn,
            onboardingStyles.primaryBtnSticky,
            pressed && onboardingStyles.primaryBtnPressed,
          ]}
          onPress={() => void onNext()}
        >
          <Text style={onboardingStyles.primaryBtnText}>Devam et</Text>
        </Pressable>
      </View>
    </OnboardingChrome>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: ONBOARDING_THEME.text,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  subtitle: { fontSize: 14, lineHeight: 20, color: ONBOARDING_THEME.muted, marginBottom: 18 },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  loadingText: { fontSize: 13, color: ONBOARDING_THEME.muted },
  list: { flex: 1 },
  listContent: { paddingBottom: 16, gap: 12 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: ONBOARDING_THEME.border,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: ONBOARDING_THEME.bg,
    shadowColor: ONBOARDING_THEME.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  optionActive: {
    borderColor: ONBOARDING_THEME.primary,
    backgroundColor: "#f7faf4",
  },
  optionTextWrap: { flex: 1, paddingRight: 12 },
  optionText: { fontSize: 16, fontWeight: "600", color: ONBOARDING_THEME.text },
  optionTextActive: { color: ONBOARDING_THEME.text },
  optionDesc: { fontSize: 13, color: ONBOARDING_THEME.muted, marginTop: 4, lineHeight: 18 },
});
