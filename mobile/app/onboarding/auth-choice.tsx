import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { OnboardingChrome } from "../../components/onboarding/OnboardingChrome";
import { useAuth } from "../../contexts/AuthContext";
import { createGuestSession } from "../../lib/authApi";
import { getOrCreateGuestClientId } from "../../lib/guestId";
import { loadOnboardingProfile, setOnboardingComplete } from "../../lib/onboardingStorage";
import { useTheme } from "../../contexts/ThemeContext";

export default function OnboardingAuthChoice() {
  const router = useRouter();
  const { colors } = useTheme();
  const { setSession, refreshOnboardingFromStorage } = useAuth();
  const s = useMemo(() => createStyles(colors), [colors]);
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
      const res = await createGuestSession(guestId, profile?.displayName, profile?.examTargetId);
      await setSession(res.token, res.user);
      await finishAndGoHome();
    } catch (e) {
      Alert.alert("Bağlantı hatası", e instanceof Error ? e.message : "Misafir oturumu açılamadı.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <OnboardingChrome progress={0.78}>
      <View style={s.flex}>
        <Text style={s.eyebrow}>Son adım</Text>
        <Text style={s.title}>Hesabını kaydet veya misafir devam et</Text>
        <Text style={s.sub}>Daha sonra e-posta ile giriş yaparak verilerini eşleştirebilirsin.</Text>

        <Pressable
          style={({ pressed }) => [s.primary, pressed && s.pressed]}
          onPress={() => router.push("/onboarding/email")}
          disabled={loading !== null}
        >
          <Text style={s.primaryText}>E-postayla giriş yap</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [s.secondary, pressed && s.pressed]}
          onPress={() => void onGuest()}
          disabled={loading !== null}
        >
          {loading === "guest" ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={s.secondaryText}>Misafir olarak devam et</Text>
          )}
        </Pressable>

        <Text style={s.legal}>
          Devam ederek verilerinin cihazında ve sunucuda işlenmesini kabul etmiş olursun. (Yakında: Kullanım Şartları)
        </Text>
      </View>
    </OnboardingChrome>
  );
}

function createStyles(colors: { text: string; muted: string; card: string; border: string; accent: string; onAccent: string }) {
  return StyleSheet.create({
    flex: { flex: 1, paddingTop: 8 },
    eyebrow: { fontSize: 14, color: colors.muted, textAlign: "center", marginBottom: 12 },
    title: { fontSize: 22, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: 12 },
    sub: { fontSize: 14, lineHeight: 20, color: colors.muted, textAlign: "center", marginBottom: 28 },
    primary: {
      backgroundColor: colors.accent,
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
      marginBottom: 12,
    },
    secondary: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
    },
    pressed: { opacity: 0.9 },
    primaryText: { color: colors.onAccent, fontSize: 17, fontWeight: "700" },
    secondaryText: { color: colors.text, fontSize: 16, fontWeight: "600" },
    legal: { marginTop: "auto", marginBottom: 28, fontSize: 12, lineHeight: 18, color: colors.muted, textAlign: "center" },
  });
}
