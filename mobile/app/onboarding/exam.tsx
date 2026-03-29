import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { OnboardingChrome } from "../../components/onboarding/OnboardingChrome";
import { ONBOARDING_EXAM_OPTIONS } from "../../constants/onboarding";
import { loadOnboardingProfile, saveOnboardingProfile } from "../../lib/onboardingStorage";
import { useTheme } from "../../contexts/ThemeContext";

export default function OnboardingExam() {
  const router = useRouter();
  const { colors } = useTheme();
  const s = useMemo(() => createStyles(colors), [colors]);
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
    <OnboardingChrome progress={0.55}>
      <View style={s.flex}>
        <Text style={s.eyebrow}>Söyle bakalım… 💭</Text>
        <Text style={s.title}>En çok hangi sınava hazırlanıyorsun?</Text>
        <ScrollView style={s.list} contentContainerStyle={s.listContent} showsVerticalScrollIndicator={false}>
          {ONBOARDING_EXAM_OPTIONS.map((opt) => {
            const active = selected === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setSelected(opt.id)}
                style={({ pressed }) => [
                  s.option,
                  { borderColor: active ? colors.accent : colors.border, backgroundColor: colors.card },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={[s.optionText, active && { color: colors.accent }]}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable style={({ pressed }) => [s.primary, pressed && s.pressed]} onPress={() => void onNext()}>
          <Text style={s.primaryText}>Devam et</Text>
        </Pressable>
      </View>
    </OnboardingChrome>
  );
}

function createStyles(colors: { text: string; muted: string; card: string; border: string; accent: string; onAccent: string }) {
  return StyleSheet.create({
    flex: { flex: 1 },
    eyebrow: { fontSize: 14, color: colors.muted, textAlign: "center", marginBottom: 12 },
    title: { fontSize: 22, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: 20 },
    list: { flex: 1 },
    listContent: { paddingBottom: 16, gap: 10 },
    option: {
      borderWidth: 1,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 18,
    },
    optionText: { fontSize: 16, fontWeight: "600", color: colors.text },
    primary: {
      marginBottom: 32,
      backgroundColor: colors.accent,
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
    },
    pressed: { opacity: 0.92 },
    primaryText: { color: colors.onAccent, fontSize: 17, fontWeight: "700" },
  });
}
