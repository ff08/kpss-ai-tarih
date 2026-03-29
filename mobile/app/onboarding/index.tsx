import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { OnboardingChrome } from "../../components/onboarding/OnboardingChrome";
import { onboardingStyles } from "../../components/onboarding/onboardingStyles";
import { APP_NAME } from "../../constants/app";
import { ONBOARDING_STEP, ONBOARDING_THEME, ONBOARDING_TOTAL_STEPS } from "../../constants/onboardingTheme";

export default function OnboardingWelcome() {
  const router = useRouter();

  return (
    <OnboardingChrome
      progress={ONBOARDING_STEP.welcome / ONBOARDING_TOTAL_STEPS}
      showBack={false}
      stepCurrent={ONBOARDING_STEP.welcome}
      stepTotal={ONBOARDING_TOTAL_STEPS}
    >
      <View style={styles.body}>
        <Text style={styles.logo}>{APP_NAME}</Text>
        <Text style={styles.headline}>Tarih müfredatında daha hızlı ilerle</Text>
        <Text style={styles.sub}>
          Yapay zeka destekli kartlar ve çalışma yolu ile KPSS Tarih&apos;e odaklan.
        </Text>
        <Pressable
          style={({ pressed }) => [
            onboardingStyles.primaryBtn,
            onboardingStyles.primaryBtnSticky,
            pressed && onboardingStyles.primaryBtnPressed,
          ]}
          onPress={() => router.push("/onboarding/name")}
        >
          <Text style={onboardingStyles.primaryBtnText}>Başla</Text>
        </Pressable>
      </View>
    </OnboardingChrome>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingTop: 8 },
  logo: {
    fontSize: 13,
    fontWeight: "700",
    color: ONBOARDING_THEME.muted,
    letterSpacing: 1.4,
    marginBottom: 16,
  },
  headline: {
    fontSize: 28,
    fontWeight: "800",
    color: ONBOARDING_THEME.text,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  sub: { fontSize: 15, lineHeight: 22, color: ONBOARDING_THEME.muted, marginBottom: 28 },
});
