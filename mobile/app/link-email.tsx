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
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthFlowChrome } from "../components/onboarding/AuthFlowChrome";
import { onboardingStyles } from "../components/onboarding/onboardingStyles";
import { ONBOARDING_THEME } from "../constants/onboardingTheme";
import { sendOtp } from "../lib/authApi";

const LINK_STEPS = 2;

export default function LinkEmailScreen() {
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
      router.push({ pathname: "/link-verify", params: { email: trimmed } });
    } catch (e) {
      Alert.alert("Hata", e instanceof Error ? e.message : "Kod gönderilemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <AuthFlowChrome
        title="E-posta ile giriş"
        subtitle="Adresine tek kullanımlık doğrulama kodu gönderilecek."
        stepCurrent={1}
        stepTotal={LINK_STEPS}
        progress={0.5}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
          <View style={styles.body}>
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
      </AuthFlowChrome>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: ONBOARDING_THEME.bg },
  flex: { flex: 1 },
  body: { flex: 1, paddingTop: 4 },
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
