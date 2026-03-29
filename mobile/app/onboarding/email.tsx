import { useMemo, useState } from "react";
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
import { OnboardingChrome } from "../../components/onboarding/OnboardingChrome";
import { sendOtp } from "../../lib/authApi";
import { useTheme } from "../../contexts/ThemeContext";

export default function OnboardingEmail() {
  const router = useRouter();
  const { colors } = useTheme();
  const s = useMemo(() => createStyles(colors), [colors]);
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
    <OnboardingChrome progress={0.88}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.flex}>
        <View style={s.body}>
          <Text style={s.title}>E-posta adresin nedir?</Text>
          <TextInput
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setErr(null);
            }}
            placeholder="ornek@adres.com"
            placeholderTextColor={colors.muted}
            style={[s.input, err ? s.inputErr : null]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => void onContinue()}
          />
          {err ? (
            <Text style={s.errText}>
              ⚠ {err}
            </Text>
          ) : null}
        </View>
        <Pressable style={({ pressed }) => [s.primary, pressed && s.pressed]} onPress={() => void onContinue()} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.onAccent} /> : <Text style={s.primaryText}>Devam et</Text>}
        </Pressable>
      </KeyboardAvoidingView>
    </OnboardingChrome>
  );
}

function createStyles(colors: { text: string; muted: string; card: string; border: string; accent: string; onAccent: string }) {
  return StyleSheet.create({
    flex: { flex: 1 },
    body: { flex: 1, paddingTop: 8 },
    title: { fontSize: 22, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: 24 },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 18,
      paddingVertical: 16,
      fontSize: 17,
      color: colors.text,
    },
    inputErr: { borderColor: "#e57373" },
    errText: { color: "#e57373", fontSize: 13, marginTop: 8 },
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
