import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { OnboardingChrome } from "../../components/onboarding/OnboardingChrome";
import { onboardingStyles } from "../../components/onboarding/onboardingStyles";
import { ONBOARDING_STEP, ONBOARDING_THEME, ONBOARDING_TOTAL_STEPS } from "../../constants/onboardingTheme";
import { useAuth } from "../../contexts/AuthContext";
import { createGuestSession } from "../../lib/authApi";
import { getOrCreateGuestClientId } from "../../lib/guestId";
import { loadOnboardingProfile, setOnboardingComplete } from "../../lib/onboardingStorage";

export default function OnboardingAuthChoice() {
  const router = useRouter();
  const { setSession, refreshOnboardingFromStorage } = useAuth();
  const [loading, setLoading] = useState<"guest" | null>(null);

  const finishAndGoHome = async () => {
    await setOnboardingComplete(true);
    await refreshOnboardingFromStorage();
    router.replace("/(tabs)");
  };

  const onGuest = async () => {
    setLoading("guest");
    try {
      const profile = await loadOnboardingProfile();
      const guestId = await getOrCreateGuestClientId();
      const res = await createGuestSession(guestId, profile?.displayName, profile?.examTargetId, profile?.examSlug);
      await setSession(res.token, res.user);
      await finishAndGoHome();
    } catch (e) {
      Alert.alert("Bağlantı hatası", e instanceof Error ? e.message : "Misafir oturumu açılamadı.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <OnboardingChrome
      progress={ONBOARDING_STEP.authChoice / ONBOARDING_TOTAL_STEPS}
      stepCurrent={ONBOARDING_STEP.authChoice}
      stepTotal={ONBOARDING_TOTAL_STEPS}
    >
      <View style={styles.flex}>
        <Text style={styles.title}>Hesabını kaydet veya misafir devam et</Text>
        <Text style={styles.subtitle}>
          E-posta ile giriş yaparak ilerlemenizi cihazlar arasında eşleştirebilirsiniz. İsterseniz sonra da Hesabım
          üzerinden bağlayabilirsiniz.
        </Text>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [onboardingStyles.primaryBtn, { marginBottom: 12 }, pressed && onboardingStyles.primaryBtnPressed]}
            onPress={() => router.push("/onboarding/email")}
            disabled={loading !== null}
          >
            <Text style={onboardingStyles.primaryBtnText}>E-postayla giriş yap</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [onboardingStyles.secondaryBtn, pressed && { opacity: 0.92 }]}
            onPress={() => void onGuest()}
            disabled={loading !== null}
          >
            {loading === "guest" ? (
              <ActivityIndicator color={ONBOARDING_THEME.text} />
            ) : (
              <Text style={onboardingStyles.secondaryBtnText}>Misafir olarak devam et</Text>
            )}
          </Pressable>
        </View>

        <Text style={styles.legal}>
          Devam ederek verilerinizin işlenmesini kabul etmiş olursunuz (Gizlilik ve Kullanım politikaları uygulama
          içinde).
        </Text>
      </View>
    </OnboardingChrome>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, paddingTop: 4 },
  actions: { marginTop: 8, gap: 0 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: ONBOARDING_THEME.text,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  subtitle: { fontSize: 14, lineHeight: 21, color: ONBOARDING_THEME.muted, marginBottom: 20 },
  legal: { marginTop: "auto", marginBottom: 28, fontSize: 12, lineHeight: 18, color: ONBOARDING_THEME.muted },
});
