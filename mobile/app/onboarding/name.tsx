import { useEffect, useMemo, useState } from "react";
import {
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
import { loadOnboardingProfile, saveOnboardingProfile } from "../../lib/onboardingStorage";
import { useTheme } from "../../contexts/ThemeContext";

export default function OnboardingName() {
  const router = useRouter();
  const { colors } = useTheme();
  const s = useMemo(() => createStyles(colors), [colors]);
  const [name, setName] = useState("");

  useEffect(() => {
    void loadOnboardingProfile().then((p) => {
      if (p?.displayName) setName(p.displayName);
    });
  }, []);

  const onNext = async () => {
    const prev = (await loadOnboardingProfile()) ?? { displayName: "", examTargetId: "diger" };
    await saveOnboardingProfile({ ...prev, displayName: name.trim() || "Öğrenci" });
    router.push("/onboarding/exam");
  };

  return (
    <OnboardingChrome progress={0.35}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.flex}>
        <View style={s.body}>
          <Text style={s.eyebrow}>Çalışma profilini kişiselleştirelim ✨</Text>
          <Text style={s.title}>Adın ne?</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Adın"
            placeholderTextColor={colors.muted}
            style={s.input}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => void onNext()}
          />
        </View>
        <Pressable style={({ pressed }) => [s.primary, pressed && s.pressed]} onPress={() => void onNext()}>
          <Text style={s.primaryText}>Devam et</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </OnboardingChrome>
  );
}

function createStyles(colors: { text: string; muted: string; card: string; border: string; accent: string; onAccent: string }) {
  return StyleSheet.create({
    flex: { flex: 1 },
    body: { flex: 1, paddingTop: 8 },
    eyebrow: { fontSize: 14, color: colors.muted, textAlign: "center", marginBottom: 12 },
    title: { fontSize: 26, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: 28 },
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
