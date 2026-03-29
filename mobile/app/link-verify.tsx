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
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthFlowChrome } from "../components/onboarding/AuthFlowChrome";
import { OtpCodeInput } from "../components/onboarding/OtpCodeInput";
import { OtpResendBar } from "../components/onboarding/OtpResendBar";
import { onboardingStyles } from "../components/onboarding/onboardingStyles";
import { ONBOARDING_THEME } from "../constants/onboardingTheme";
import { useAuth } from "../contexts/AuthContext";
import { sendOtp, verifyOtp } from "../lib/authApi";

const LINK_STEPS = 2;

export default function LinkVerifyScreen() {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email: string }>();
  const email = typeof emailParam === "string" ? emailParam : "";
  const { token, setSession } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);

  useEffect(() => {
    if (!email) router.replace("/link-email");
  }, [email, router]);

  const onVerify = useCallback(async () => {
    if (!email || code.length !== 6) {
      Alert.alert("Kod", "6 haneli kodu girin");
      return;
    }
    if (!token) {
      Alert.alert("Oturum", "Tekrar giriş yapın");
      router.replace("/link-email");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtp(email, code, undefined, undefined, undefined, token);
      await setSession(res.token, res.user);
      router.replace("/(tabs)/about");
    } catch (e) {
      Alert.alert("Doğrulama", e instanceof Error ? e.message : "Kod geçersiz");
    } finally {
      setLoading(false);
    }
  }, [code, email, router, setSession, token]);

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

  if (!email) return null;

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <AuthFlowChrome
        title="Doğrulama kodu 🔐"
        subtitle="E-postana gönderilen 6 haneli kodu gir."
        stepCurrent={2}
        stepTotal={LINK_STEPS}
        progress={1}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
          <View style={styles.body}>
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
              <Text style={onboardingStyles.primaryBtnText}>Hesabı bağla</Text>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </AuthFlowChrome>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: ONBOARDING_THEME.bg },
  flex: { flex: 1 },
  body: { flex: 1, paddingTop: 4 },
  emailLine: {
    fontSize: 15,
    fontWeight: "600",
    color: ONBOARDING_THEME.primary,
    marginBottom: 24,
    textAlign: "center",
  },
});
