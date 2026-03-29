import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingChrome } from "../../components/onboarding/OnboardingChrome";
import { onboardingStyles } from "../../components/onboarding/onboardingStyles";
import { ONBOARDING_STEP, ONBOARDING_THEME, ONBOARDING_TOTAL_STEPS } from "../../constants/onboardingTheme";
import { sendOtp } from "../../lib/authApi";

export default function OnboardingEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onContinue = async () => {
    setErr(null);
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErr("Geçerli bir e-posta girin");
      return;
    }
    setLoading(true);
    try {
      await sendOtp(trimmed);
      router.push({ pathname: "/onboarding/verify", params: { email: trimmed } });
    } catch (e) {
      Alert.alert("Hata", e instanceof Error ? e.message : "Kod gönderilemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingChrome
      progress={ONBOARDING_STEP.email / ONBOARDING_TOTAL_STEPS}
      stepCurrent={ONBOARDING_STEP.email}
      stepTotal={ONBOARDING_TOTAL_STEPS}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <View style={styles.body}>
          <Text style={styles.title}>E-posta adresin nedir?</Text>
          <Text style={styles.subtitle}>Adresine tek kullanımlık doğrulama kodu göndereceğiz.</Text>
          <View style={[onboardingStyles.input, styles.inputRow, err ? onboardingStyles.inputErr : null]}>
            <Ionicons name="mail-outline" size={22} color={ONBOARDING_THEME.muted} style={styles.inputIcon} />
            <TextInput
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setErr(null);
              }}
              placeholder="ornek@adres.com"
              placeholderTextColor={ONBOARDING_THEME.muted}
              style={styles.inputField}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={() => void onContinue()}
            />
          </View>
          {err ? <Text style={styles.errText}>{err}</Text> : null}
        </View>
        <Pressable
          style={({ pressed }) => [
            onboardingStyles.primaryBtn,
            onboardingStyles.primaryBtnSticky,
            pressed && onboardingStyles.primaryBtnPressed,
          ]}
          onPress={() => void onContinue()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={ONBOARDING_THEME.onPrimary} />
          ) : (
            <Text style={onboardingStyles.primaryBtnText}>Kod gönder</Text>
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
  subtitle: { fontSize: 15, lineHeight: 22, color: ONBOARDING_THEME.muted, marginBottom: 24 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 10 },
  inputField: { flex: 1, fontSize: 17, color: ONBOARDING_THEME.text, paddingVertical: 0 },
  errText: { color: ONBOARDING_THEME.error, fontSize: 13, marginTop: 10 },
});
