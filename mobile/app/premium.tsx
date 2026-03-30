import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { APP_NAME } from "../constants/app";
import type { ColorPalette } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { fetchBillingPlans, syncRevenueCatSubscription } from "../lib/authApi";
import { useTheme } from "../contexts/ThemeContext";
import Purchases, { type PurchasesPackage } from "react-native-purchases";
import { Platform } from "react-native";
import {
  configureRevenueCat,
  entitlementFromCustomerInfo,
  getPremiumOffering,
  inferPlanFromProductId,
  isRevenueCatConfigured,
  pickMonthlyYearlyPackages,
} from "../lib/revenuecat";

export default function PremiumScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { premium, token, user, refreshUser } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [plans, setPlans] = useState<
    { id: string; plan: string; label: string; priceLabel: string; savingsHint?: string }[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>("YEARLY");
  const [packages, setPackages] = useState<{ monthly: PurchasesPackage | null; yearly: PurchasesPackage | null } | null>(null);
  const [buying, setBuying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const fallback = await fetchBillingPlans().catch(() => null);
      if (isRevenueCatConfigured() && user?.id) {
        await configureRevenueCat(user.id);
        const off = await getPremiumOffering();
        if (off) {
          const picked = pickMonthlyYearlyPackages(off);
          setPackages(picked);
          const show = [
            {
              id: "MONTHLY",
              plan: "MONTHLY",
              label: "Aylık",
              priceLabel: picked.monthly?.product.priceString ?? "₺129",
            },
            {
              id: "YEARLY",
              plan: "YEARLY",
              label: "Yıllık",
              priceLabel: picked.yearly?.product.priceString ?? "₺1290",
              savingsHint: "2 ay indirim",
            },
          ];
          setPlans(show);
          return;
        }
      }
      setPlans(fallback?.plans ?? []);
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
          style={({ pressed }) => [styles.cta, (pressed || buying) && { opacity: 0.9 }]}
          disabled={buying}
          onPress={async () => {
            if (!token || !user?.id) {
              Alert.alert("Giriş gerekli", "Premium satın almak için giriş yapmalısın.");
              return;
            }
            if (!isRevenueCatConfigured()) {
              Alert.alert("RevenueCat ayarı eksik", "Uygulama yapılandırması tamamlanmamış.");
              return;
            }
            const pkg =
              selected === "YEARLY" ? packages?.yearly : packages?.monthly;
            if (!pkg) {
              Alert.alert("Paket bulunamadı", "Ürünler yüklenemedi. Tekrar dene.");
              return;
            }
            setBuying(true);
            try {
              const { customerInfo } = await Purchases.purchasePackage(pkg);
              const ent = entitlementFromCustomerInfo(customerInfo);
              if (!ent.productId) {
                throw new Error("Entitlement aktif görünmüyor.");
              }
              await syncRevenueCatSubscription(token, {
                entitlementId: process.env.EXPO_PUBLIC_RC_ENTITLEMENT_ID ?? "premium",
                isActive: ent.isActive,
                productId: ent.productId,
                plan: inferPlanFromProductId(ent.productId),
                currentPeriodEnd: ent.expiresAtIso,
                appUserId: user.id,
                platform: Platform.OS === "ios" ? "ios" : "android",
              });
              await refreshUser();
              router.back();
            } catch (e) {
              // Kullanıcı iptali sessiz
              if (e && typeof e === "object" && "userCancelled" in (e as object)) return;
              Alert.alert("Satın alma başarısız", e instanceof Error ? e.message : "Bir hata oluştu");
            } finally {
              setBuying(false);
            }
          }}
        >
          <Text style={styles.ctaText}>{buying ? "Satın alınıyor…" : "Satın al"}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.restoreBtn, pressed && { opacity: 0.9 }]}
          onPress={async () => {
            if (!token || !user?.id) return;
            if (!isRevenueCatConfigured()) return;
            setBuying(true);
            try {
              await configureRevenueCat(user.id);
              const ci = await Purchases.restorePurchases();
              const ent = entitlementFromCustomerInfo(ci);
              if (!ent.productId) return;
              await syncRevenueCatSubscription(token, {
                entitlementId: process.env.EXPO_PUBLIC_RC_ENTITLEMENT_ID ?? "premium",
                isActive: ent.isActive,
                productId: ent.productId,
                plan: inferPlanFromProductId(ent.productId),
                currentPeriodEnd: ent.expiresAtIso,
                appUserId: user.id,
                platform: Platform.OS === "ios" ? "ios" : "android",
              });
              await refreshUser();
              Alert.alert("Geri yüklendi", "Premium durumun güncellendi.");
            } finally {
              setBuying(false);
            }
          }}
          accessibilityRole="button"
          accessibilityLabel="Satın alımı geri yükle"
        >
          <Text style={styles.restoreText}>Satın alımı geri yükle</Text>
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
    restoreBtn: {
      marginTop: 14,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    restoreText: { color: colors.text, fontSize: 14, fontWeight: "700" },
  });
}
