import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import { ONBOARDING_THEME } from "../../constants/onboardingTheme";
import { isIntroWizardComplete } from "../../lib/onboardingStorage";

/** İlk açılış: splash → tanıtım slaytları; tamamlanmışsa doğrudan adım 1 (isim). */
export default function OnboardingEntry() {
  const [target, setTarget] = useState<"splash" | "name" | null>(null);

  useEffect(() => {
    void isIntroWizardComplete().then((done) => setTarget(done ? "name" : "splash"));
  }, []);

  if (target === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={ONBOARDING_THEME.primary} />
      </View>
    );
  }

  if (target === "splash") return <Redirect href="/onboarding/splash" />;
  return <Redirect href="/onboarding/name" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ONBOARDING_THEME.bg,
  },
});
