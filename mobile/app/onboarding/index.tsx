import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { OnboardingChrome } from "../../components/onboarding/OnboardingChrome";
import { APP_NAME } from "../../constants/app";
import { useTheme } from "../../contexts/ThemeContext";

export default function OnboardingWelcome() {
  const router = useRouter();
  const { colors } = useTheme();
  const s = useMemo(() => createStyles(colors), [colors]);

  return (
    <OnboardingChrome progress={0.12} showBack={false}>
      <View style={s.body}>
        <Text style={s.logo}>{APP_NAME}</Text>
        <Text style={s.headline}>
          <Text style={s.accent}>Tarih</Text>
          <Text style={s.headRest}> müfredatında</Text>
        </Text>
        <Text style={s.headline}>daha hızlı ilerle</Text>
        <Text style={s.sub}>Yapay zeka destekli kartlar ve çalışma yolu ile KPSS Tarih&apos;e odaklan.</Text>
        <Pressable style={({ pressed }) => [s.primary, pressed && s.primaryPressed]} onPress={() => router.push("/onboarding/name")}>
          <Text style={s.primaryText}>Başla</Text>
        </Pressable>
      </View>
    </OnboardingChrome>
  );
}

function createStyles(colors: { bg: string; text: string; muted: string; accent: string; onAccent: string }) {
  return StyleSheet.create({
    body: { flex: 1, paddingTop: 24 },
    logo: { fontSize: 14, fontWeight: "700", color: colors.muted, letterSpacing: 1.2, marginBottom: 20 },
    headline: { fontSize: 28, fontWeight: "800", color: colors.text, lineHeight: 36 },
    accent: { color: "#e8c547" },
    headRest: { color: colors.text },
    sub: { marginTop: 16, fontSize: 15, lineHeight: 22, color: colors.muted, marginBottom: 36 },
    primary: {
      marginTop: "auto",
      marginBottom: 36,
      backgroundColor: colors.accent,
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
    },
    primaryPressed: { opacity: 0.9 },
    primaryText: { color: colors.onAccent, fontSize: 17, fontWeight: "700" },
  });
}
