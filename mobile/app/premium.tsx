import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { APP_NAME } from "../constants/app";
import type { ColorPalette } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { fetchBillingPlans } from "../lib/authApi";
import { useTheme } from "../contexts/ThemeContext";

export default function PremiumScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { premium } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [plans, setPlans] = useState<
    { id: string; plan: string; label: string; priceLabel: string; savingsHint?: string }[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>("YEARLY");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBillingPlans();
      setPlans(data.plans);
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Kapat">
          <Ionicons name="close" size={26} color={colors.text} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.brand}>{APP_NAME}</Text>
        <Text style={styles.title}>Premium’a geç</Text>
        <Text style={styles.sub}>Tüm kilitleri anında aç; önce müfredatı bitir, sonra ileri konulara geç.</Text>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={colors.accent} size="large" />
        ) : (
          plans?.map((p) => {
            const active = selected === p.plan;
            const isYear = p.plan === "YEARLY";
            return (
              <Pressable
                key={p.id}
                onPress={() => setSelected(p.plan)}
                style={[
                  styles.card,
                  {
                    borderColor: active ? colors.accent : colors.border,
                    backgroundColor: colors.card,
                  },
                  isYear && styles.cardHighlight,
                ]}
              >
                {isYear ? (
                  <View style={[styles.badge, { backgroundColor: "#c9a227" }]}>
                    <Text style={styles.badgeText}>En avantajlı</Text>
                  </View>
                ) : null}
                <View style={styles.cardRow}>
                  <View style={[styles.radio, { borderColor: active ? colors.accent : colors.muted }]}>
                    {active ? <View style={[styles.radioInner, { backgroundColor: colors.accent }]} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{p.label}</Text>
                    <Text style={styles.cardPrice}>{p.priceLabel}</Text>
                    {p.savingsHint ? <Text style={styles.hint}>{p.savingsHint}</Text> : null}
                  </View>
                </View>
              </Pressable>
            );
          })
        )}

        <View style={styles.trust}>
          <Text style={styles.trustText}>Ödeme altyapısı yakında aktif olacak. Şimdilik uygulama ücretsiz kullanılabilir.</Text>
        </View>

        {premium ? (
          <Text style={styles.activeNote}>Premium üyeliğin aktif görünüyor.</Text>
        ) : null}

        <Pressable
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
          onPress={() => {
            /* Stripe / ödeme entegrasyonu */
          }}
        >
          <Text style={styles.ctaText}>Devam et (yakında)</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    headerRow: { flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 8 },
    closeBtn: { padding: 12 },
    scroll: { paddingHorizontal: 22, paddingBottom: 40 },
    brand: { textAlign: "center", fontSize: 13, fontWeight: "700", color: colors.muted, marginBottom: 12 },
    title: { fontSize: 26, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: 8 },
    sub: { fontSize: 15, lineHeight: 22, color: colors.muted, textAlign: "center", marginBottom: 28 },
    card: {
      borderRadius: 16,
      borderWidth: 2,
      padding: 16,
      marginBottom: 12,
      overflow: "hidden",
    },
    cardHighlight: {},
    badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
    badgeText: { fontSize: 11, fontWeight: "800", color: "#1a1200" },
    cardRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      marginTop: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    radioInner: { width: 12, height: 12, borderRadius: 6 },
    cardTitle: { fontSize: 17, fontWeight: "700", color: colors.text },
    cardPrice: { fontSize: 22, fontWeight: "800", color: colors.text, marginTop: 4 },
    hint: { fontSize: 13, color: colors.muted, marginTop: 4 },
    trust: { marginTop: 20, padding: 14, borderRadius: 12, backgroundColor: colors.surface },
    trustText: { fontSize: 13, lineHeight: 19, color: colors.muted, textAlign: "center" },
    activeNote: { textAlign: "center", color: colors.accent, fontWeight: "600", marginTop: 12 },
    cta: {
      marginTop: 24,
      backgroundColor: colors.accent,
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
    },
    ctaText: { color: colors.onAccent, fontSize: 17, fontWeight: "700" },
  });
}
