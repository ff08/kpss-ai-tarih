import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { APP_NAME } from "../../constants/app";
import { ONBOARDING_THEME } from "../../constants/onboardingTheme";

const SPLASH_MS = 2000;

export default function OnboardingSplash() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/onboarding/intro"), SPLASH_MS);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right", "bottom"]}>
      <StatusBar style="light" />
      <View style={styles.center}>
        <View style={styles.logoMark}>
          <Ionicons name="book-outline" size={56} color={ONBOARDING_THEME.onPrimary} />
        </View>
        <Text style={styles.name}>{APP_NAME}</Text>
        <Text style={styles.tag}>KPSS Tarih</Text>
      </View>
      <ActivityIndicator size="large" color={ONBOARDING_THEME.onPrimary} style={styles.spinner} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ONBOARDING_THEME.primary,
    justifyContent: "space-between",
    paddingBottom: 48,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  logoMark: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: "800",
    color: ONBOARDING_THEME.onPrimary,
    letterSpacing: -0.5,
  },
  tag: { marginTop: 8, fontSize: 15, color: "rgba(255,255,255,0.9)", fontWeight: "600" },
  spinner: { alignSelf: "center" },
});
