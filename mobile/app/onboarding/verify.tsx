import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
import { OnboardingChrome } from "../../components/onboarding/OnboardingChrome";
import { useAuth } from "../../contexts/AuthContext";
import { verifyOtp } from "../../lib/authApi";
import { loadOnboardingProfile, setOnboardingComplete } from "../../lib/onboardingStorage";
import { useTheme } from "../../contexts/ThemeContext";

export default function OnboardingVerify() {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email: string }>();
  const email = typeof emailParam === "string" ? emailParam : "";
  const { colors } = useTheme();
  const { setSession, refreshOnboardingFromStorage } = useAuth();
  const s = useMemo(() => createStyles(colors), [colors]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) router.replace("/onboarding/email");
  }, [email, router]);

  const onVerify = async () => {
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
  };

  if (!email) {
    return null;
  }

  return (
    <OnboardingChrome progress={0.95}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.flex}>
        <View style={s.body}>
          <Text style={s.sub}>Kod gönderildi:</Text>
          <Text style={s.email}>{email}</Text>
          <Text style={s.title}>6 haneli kodu gir</Text>
          <TextInput
            value={code}
            onChangeText={(t) => setCode(t.replace(/\D/g, "").slice(0, 6))}
            placeholder="• • • • • •"
            placeholderTextColor={colors.muted}
            style={s.input}
            keyboardType="number-pad"
            maxLength={6}
            returnKeyType="done"
            onSubmitEditing={() => void onVerify()}
          />
        </View>
        <Pressable style={({ pressed }) => [s.primary, pressed && s.pressed]} onPress={() => void onVerify()} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.onAccent} /> : <Text style={s.primaryText}>Giriş yap</Text>}
        </Pressable>
      </KeyboardAvoidingView>
    </OnboardingChrome>
  );
}

function createStyles(colors: { text: string; muted: string; card: string; border: string; accent: string; onAccent: string }) {
  return StyleSheet.create({
    flex: { flex: 1 },
    body: { flex: 1, paddingTop: 8 },
    sub: { fontSize: 14, color: colors.muted, textAlign: "center" },
    email: { fontSize: 15, fontWeight: "600", color: colors.accent, textAlign: "center", marginBottom: 20 },
    title: { fontSize: 22, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: 20 },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 18,
      paddingVertical: 16,
      fontSize: 22,
      letterSpacing: 8,
      color: colors.text,
      textAlign: "center",
    },
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
