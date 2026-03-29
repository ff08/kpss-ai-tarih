import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { OnboardingChrome } from "../../components/onboarding/OnboardingChrome";
import { onboardingStyles } from "../../components/onboarding/onboardingStyles";
import { ONBOARDING_STEP, ONBOARDING_THEME, ONBOARDING_TOTAL_STEPS } from "../../constants/onboardingTheme";
import { loadOnboardingProfile, saveOnboardingProfile } from "../../lib/onboardingStorage";

export default function OnboardingName() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    void loadOnboardingProfile().then((p) => {
      if (p?.displayName) setName(p.displayName);
    });
  }, []);

  const onNext = async () => {
    const prev = (await loadOnboardingProfile()) ?? { displayName: "", examTargetId: "diger" };
    await saveOnboardingProfile({ ...prev, displayName: name.trim() || "Öğrenci" });
    router.push("/onboarding/exam");
  };

  return (
    <OnboardingChrome
      progress={ONBOARDING_STEP.name / ONBOARDING_TOTAL_STEPS}
      stepCurrent={ONBOARDING_STEP.name}
      stepTotal={ONBOARDING_TOTAL_STEPS}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <View style={styles.body}>
          <Text style={styles.title}>Sana nasıl seslenelim?</Text>
          <Text style={styles.subtitle}>Önce kısa bir isim veya takma ad yaz.</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Adın"
            placeholderTextColor={ONBOARDING_THEME.muted}
            style={onboardingStyles.input}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => void onNext()}
          />
        </View>
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
      </KeyboardAvoidingView>
    </OnboardingChrome>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { flex: 1, paddingTop: 4 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: ONBOARDING_THEME.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 15, lineHeight: 22, color: ONBOARDING_THEME.muted, marginBottom: 28 },
});
