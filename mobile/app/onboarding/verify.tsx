import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { OnboardingChrome } from "../../components/onboarding/OnboardingChrome";
import { OtpCodeInput } from "../../components/onboarding/OtpCodeInput";
import { OtpResendBar } from "../../components/onboarding/OtpResendBar";
import { onboardingStyles } from "../../components/onboarding/onboardingStyles";
import { ONBOARDING_STEP, ONBOARDING_THEME, ONBOARDING_TOTAL_STEPS } from "../../constants/onboardingTheme";
import { useAuth } from "../../contexts/AuthContext";
import { sendOtp, verifyOtp } from "../../lib/authApi";
import { loadOnboardingProfile, setOnboardingComplete } from "../../lib/onboardingStorage";

export default function OnboardingVerify() {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email: string }>();
  const email = typeof emailParam === "string" ? emailParam : "";
  const { setSession, refreshOnboardingFromStorage } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);

  useEffect(() => {
    if (!email) router.replace("/onboarding/email");
  }, [email, router]);

  const onVerify = useCallback(async () => {
    if (!email || code.length !== 6) {
      Alert.alert("Kod", "6 haneli kodu girin");
      return;
    }
    setLoading(true);
    try {
      const profile = await loadOnboardingProfile();
      const res = await verifyOtp(email, code, profile?.displayName, profile?.examTargetId);
      await setSession(res.token, res.user);
      await setOnboardingComplete(true);
      await refreshOnboardingFromStorage();
      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert("Doğrulama", e instanceof Error ? e.message : "Kod geçersiz");
    } finally {
      setLoading(false);
    }
  }, [code, email, refreshOnboardingFromStorage, router, setSession]);

  const onResend = useCallback(async () => {
    if (!email) return;
    setResendBusy(true);
    try {
      await sendOtp(email);
    } catch (e) {
      Alert.alert("Hata", e instanceof Error ? e.message : "Kod gönderilemedi");
    } finally {
      setResendBusy(false);
    }
  }, [email]);

  const onOtpComplete = useCallback(() => {
    void onVerify();
  }, [onVerify]);

  if (!email) {
    return null;
  }

  return (
    <OnboardingChrome
      progress={ONBOARDING_STEP.verify / ONBOARDING_TOTAL_STEPS}
      stepCurrent={ONBOARDING_STEP.verify}
      stepTotal={ONBOARDING_TOTAL_STEPS}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <View style={styles.body}>
          <Text style={styles.title}>Doğrulama kodu 🔐</Text>
          <Text style={styles.subtitle}>
            E-postana gönderilen 6 haneli kodu gir. Gelen kutunu ve spam klasörünü kontrol et.
          </Text>
          <Text style={styles.emailLine} selectable>
            {email}
          </Text>
          <OtpCodeInput value={code} onChangeText={setCode} onComplete={onOtpComplete} />
          <OtpResendBar onResend={onResend} sending={resendBusy} />
        </View>
        <Pressable
          style={({ pressed }) => [
            onboardingStyles.primaryBtn,
            onboardingStyles.primaryBtnSticky,
            pressed && onboardingStyles.primaryBtnPressed,
          ]}
          onPress={() => void onVerify()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={ONBOARDING_THEME.onPrimary} />
          ) : (
            <Text style={onboardingStyles.primaryBtnText}>Giriş yap</Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </OnboardingChrome>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { flex: 1, paddingTop: 4 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: ONBOARDING_THEME.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 15, lineHeight: 22, color: ONBOARDING_THEME.muted, marginBottom: 12 },
  emailLine: {
    fontSize: 15,
    fontWeight: "600",
    color: ONBOARDING_THEME.primary,
    marginBottom: 24,
    textAlign: "center",
  },
});
