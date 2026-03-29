import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ONBOARDING_THEME } from "../../constants/onboardingTheme";

type Props = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  /** Küçük adım göstergesi (örn. e-posta akışı 1/2) */
  stepCurrent?: number;
  stepTotal?: number;
  /** İnce üst ilerleme çubuğu (0–1) */
  progress?: number;
};

export function AuthFlowChrome({
  children,
  title,
  subtitle,
  showBack = true,
  onBack,
  stepCurrent,
  stepTotal,
  progress,
}: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const showStep = typeof stepCurrent === "number" && typeof stepTotal === "number" && stepTotal > 0;
  const p = progress !== undefined ? Math.min(1, Math.max(0, progress)) : null;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.topRow}>
        {showBack ? (
          <Pressable
            onPress={() => (onBack ? onBack() : router.back())}
            style={styles.backBtn}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Geri"
          >
            <Ionicons name="arrow-back" size={24} color={ONBOARDING_THEME.text} />
          </Pressable>
        ) : (
          <View style={styles.sidePlaceholder} />
        )}
        {p !== null ? (
          <View style={[styles.track, { backgroundColor: ONBOARDING_THEME.trackBg }]}>
            <View style={[styles.fill, { width: `${p * 100}%`, backgroundColor: ONBOARDING_THEME.primary }]} />
          </View>
        ) : (
          <View style={styles.trackSpacer} />
        )}
        {showStep ? (
          <Text style={styles.stepText}>
            {stepCurrent} / {stepTotal}
          </Text>
        ) : (
          <View style={styles.sidePlaceholder} />
        )}
      </View>

      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 22,
    backgroundColor: ONBOARDING_THEME.bg,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "flex-start" },
  sidePlaceholder: { width: 40 },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  trackSpacer: { flex: 1 },
  fill: { height: "100%", borderRadius: 999 },
  stepText: {
    minWidth: 40,
    fontSize: 14,
    fontWeight: "600",
    color: ONBOARDING_THEME.muted,
    textAlign: "right",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: ONBOARDING_THEME.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: ONBOARDING_THEME.muted,
    marginBottom: 24,
  },
});
