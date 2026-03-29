import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingChrome } from "../../components/onboarding/OnboardingChrome";
import { onboardingStyles } from "../../components/onboarding/onboardingStyles";
import { ONBOARDING_EXAM_OPTIONS } from "../../constants/onboarding";
import { ONBOARDING_STEP, ONBOARDING_THEME, ONBOARDING_TOTAL_STEPS } from "../../constants/onboardingTheme";
import { loadOnboardingProfile, saveOnboardingProfile } from "../../lib/onboardingStorage";

export default function OnboardingExam() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    void loadOnboardingProfile().then((p) => {
      if (p?.examTargetId) setSelected(p.examTargetId);
    });
  }, []);

  const onNext = async () => {
    const id = selected ?? "diger";
    const prev = (await loadOnboardingProfile()) ?? { displayName: "Öğrenci", examTargetId: id };
    await saveOnboardingProfile({ ...prev, examTargetId: id });
    router.push("/onboarding/auth-choice");
  };

  return (
    <OnboardingChrome
      progress={ONBOARDING_STEP.exam / ONBOARDING_TOTAL_STEPS}
      stepCurrent={ONBOARDING_STEP.exam}
      stepTotal={ONBOARDING_TOTAL_STEPS}
    >
      <View style={styles.flex}>
        <Text style={styles.title}>En çok hangi sınava hazırlanıyorsun?</Text>
        <Text style={styles.subtitle}>Bir seçenek seç; müfredat önerilerini buna göre ayarlarız.</Text>
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {ONBOARDING_EXAM_OPTIONS.map((opt) => {
            const active = selected === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setSelected(opt.id)}
                style={({ pressed }) => [
                  styles.option,
                  active && styles.optionActive,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt.label}</Text>
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
  optionText: { fontSize: 16, fontWeight: "600", color: ONBOARDING_THEME.text, flex: 1, paddingRight: 12 },
  optionTextActive: { color: ONBOARDING_THEME.text },
});
