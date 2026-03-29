import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { ABOUT_POLICIES, POLICY_ORDER, type PolicyId } from "../../constants/aboutPolicies";
import type { ColorPalette } from "../../constants/theme";
import { APP_NAME, APP_TAGLINE } from "../../constants/app";
import { SUPPORT_EMAIL } from "../../constants/support";
import { examSlugToLegacyExamTargetId } from "../../constants/examCatalog";
import { fetchCatalogExams, type CatalogExam } from "../../lib/api";
import { createGuestSession, updateMyExam } from "../../lib/authApi";
import { getOrCreateGuestClientId } from "../../lib/guestId";
import { loadOnboardingProfile, saveOnboardingProfile } from "../../lib/onboardingStorage";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

function appVersion(): string {
  const v = Constants.expoConfig?.version ?? (Constants as { nativeAppVersion?: string }).nativeAppVersion;
  return v ?? "1.0.0";
}

export default function AboutScreen() {
  const router = useRouter();
  const { user, premium, refreshUser, token, signOut, setSession } = useAuth();
  const { colors, mode, setMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const version = appVersion();
  const [policyOpen, setPolicyOpen] = useState<PolicyId | null>(null);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [examPickerOpen, setExamPickerOpen] = useState(false);
  const [examOptions, setExamOptions] = useState<CatalogExam[]>([]);
  const [examListLoading, setExamListLoading] = useState(false);
  const [examSaving, setExamSaving] = useState(false);

  const openPolicy = policyOpen ? ABOUT_POLICIES[policyOpen] : null;

  useFocusEffect(
    useCallback(() => {
      if (token) void refreshUser();
    }, [token, refreshUser]),
  );

  const confirmLogout = useCallback(() => {
    Alert.alert(
      "Çıkış yap",
      "Oturum sunucuda kapatılır. Çalışma ilerlemeniz ve uygulama tercihleri bu cihazda saklanır; tekrar girişte kaldığınız yerden devam edebilirsiniz.",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Çıkış yap",
          style: "destructive",
          onPress: () => {
            void (async () => {
              await signOut();
              router.replace("/");
            })();
          },
        },
      ],
    );
  }, [router, signOut]);

  const openExamPicker = useCallback(() => {
    setExamPickerOpen(true);
    if (!token) return;
    setExamListLoading(true);
    void fetchCatalogExams({ includeInactive: true, token })
      .then(setExamOptions)
      .catch(() => {
        Alert.alert("Bağlantı", "Sınav listesi yüklenemedi.");
      })
      .finally(() => setExamListLoading(false));
  }, [token]);

  const onPickExam = useCallback(
    async (slug: string) => {
      if (!token) return;
      if (slug === user?.selectedExamSlug) {
        setExamPickerOpen(false);
        return;
      }
      setExamSaving(true);
      try {
        await updateMyExam(token, slug);
        await refreshUser();
        const prev = await loadOnboardingProfile();
        const dn = prev?.displayName ?? user?.displayName ?? "Öğrenci";
        await saveOnboardingProfile({
          displayName: dn,
          examTargetId: examSlugToLegacyExamTargetId(slug),
          examSlug: slug,
        });
        setExamPickerOpen(false);
        Alert.alert("Tamam", "Sınav tercihin güncellendi. Ana sayfadaki konular buna göre yüklenecek.");
      } catch (e) {
        Alert.alert("Hata", e instanceof Error ? e.message : "Güncellenemedi");
      } finally {
        setExamSaving(false);
      }
    },
    [token, user?.displayName, user?.selectedExamSlug, refreshUser],
  );

  const onGuestContinue = useCallback(async () => {
    setGuestLoading(true);
    try {
      const profile = await loadOnboardingProfile();
      const guestId = await getOrCreateGuestClientId();
      const res = await createGuestSession(guestId, profile?.displayName, profile?.examTargetId, profile?.examSlug);
      await setSession(res.token, res.user);
    } catch (e) {
      Alert.alert("Bağlantı hatası", e instanceof Error ? e.message : "Misafir oturumu açılamadı.");
    } finally {
      setGuestLoading(false);
    }
  }, [setSession]);

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <ScreenHeader title="Hesabım" tagline={APP_TAGLINE} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator>
        {user ? (
          <View style={styles.section}>
            <Text style={styles.accountLabel}>Oturum</Text>
            <Text style={styles.accountName}>{user.displayName ?? "Öğrenci"}</Text>
            <Text style={styles.accountMeta}>
              {user.email ?? "Misafir"} · {premium ? "Premium" : "Ücretsiz"}
            </Text>
            {user.isGuest ? (
              <Pressable
                style={({ pressed }) => [styles.linkEmailCta, pressed && styles.linkRowPressed]}
                onPress={() => router.push("/link-email")}
                accessibilityRole="button"
                accessibilityLabel="E-posta ile giriş yap"
              >
                <Text style={styles.linkEmailCtaText}>E-posta ile giriş yap</Text>
                <Ionicons name="mail-outline" size={20} color={colors.accent} />
              </Pressable>
            ) : null}
            <Pressable
              style={({ pressed }) => [styles.examRow, pressed && styles.linkRowPressed]}
              onPress={openExamPicker}
              accessibilityRole="button"
              accessibilityLabel="Çalıştığım sınavı değiştir"
            >
              <View style={styles.examRowText}>
                <Text style={styles.examRowLabel}>Çalıştığım sınav</Text>
                <Text style={styles.examRowValue} numberOfLines={2}>
                  {user.selectedExamLabel ?? user.selectedExamSlug ?? "—"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.logoutCta, pressed && styles.linkRowPressed]}
              onPress={confirmLogout}
              accessibilityRole="button"
              accessibilityLabel="Çıkış yap"
            >
              <Text style={styles.logoutCtaText}>Çıkış yap</Text>
              <Ionicons name="log-out-outline" size={20} color={colors.muted} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.accountLabel}>Oturum</Text>
            <Text style={styles.loginLead}>
              Giriş yaparak veya misafir olarak devam ederek çalışmanızı eşitleyebilirsiniz. Yerel ilerlemeniz bu cihazda saklanır.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.linkEmailCta, { borderTopWidth: 0, marginTop: 8 }, pressed && styles.linkRowPressed]}
              onPress={() => router.push("/link-email")}
              accessibilityRole="button"
              accessibilityLabel="E-posta ile giriş yap"
            >
              <Text style={styles.linkEmailCtaText}>E-posta ile giriş yap</Text>
              <Ionicons name="mail-outline" size={20} color={colors.accent} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.guestCta, pressed && styles.linkRowPressed]}
              onPress={() => void onGuestContinue()}
              disabled={guestLoading}
              accessibilityRole="button"
              accessibilityLabel="Misafir olarak devam et"
            >
              {guestLoading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Text style={styles.guestCtaText}>Misafir olarak devam et</Text>
              )}
            </Pressable>
          </View>
        )}

        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowPressed]}
            onPress={() => router.push("/premium")}
            accessibilityRole="button"
            accessibilityLabel="Premium"
          >
            <Text style={styles.linkRowText}>Premium’a geç</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowPressed]}
            onPress={() => router.push("/stats")}
            accessibilityRole="button"
            accessibilityLabel="İstatistik"
          >
            <Text style={styles.linkRowText}>İstatistik</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Görünüm</Text>
          <View style={styles.themeRow}>
            <View style={styles.themeLabels}>
              <Text style={styles.themeTitle}>Karanlık mod</Text>
              <Text style={styles.themeHint}>
                {mode === "dark" ? "Koyu tema açık" : "Açık tema kullanılıyor"}
              </Text>
            </View>
            <Switch
              value={mode === "dark"}
              onValueChange={(on) => setMode(on ? "dark" : "light")}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.card}
              ios_backgroundColor={colors.border}
              accessibilityRole="switch"
              accessibilityLabel="Karanlık mod"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama</Text>
          <Text style={styles.appName}>{APP_NAME}</Text>
          <Text style={styles.version}>Sürüm {version}</Text>
          <Text style={styles.body}>
            KPSS Genel Yetenek Tarih müfredatına uygun bilgi kartları, soru–cevap ve çoktan seçmeli sorularla
            tekrar yapmanız için tasarlanmıştır. Konuları sırayla çalışabilir veya rastgele modda kendinizi
            test edebilirsiniz.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Politikalar</Text>
          <Text style={styles.sectionLead}>
            Aşağıdaki başlıklara dokunarak tam metni okuyabilirsiniz.
          </Text>
          {POLICY_ORDER.map((id, index) => {
            const p = ABOUT_POLICIES[id];
            return (
              <Pressable
                key={id}
                onPress={() => setPolicyOpen(id)}
                style={({ pressed }) => [
                  styles.policyRow,
                  index > 0 && styles.policyRowBorder,
                  pressed && styles.policyRowPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={p.title}
              >
                <View style={styles.policyRowText}>
                  <Text style={styles.policyRowTitle}>{p.title}</Text>
                  <Text style={styles.policyRowSummary} numberOfLines={2}>
                    {p.summary}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.muted} />
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={({ pressed }) => [styles.deleteAccountBtn, pressed && { opacity: 0.8 }]}
          onPress={() => setDeleteAccountOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Hesabımı sil"
        >
          <Text style={styles.deleteAccountText}>Hesabımı Sil</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={examPickerOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={false}
        onRequestClose={() => !examSaving && setExamPickerOpen(false)}
      >
        <SafeAreaView style={styles.modalSafe} edges={["top", "left", "right", "bottom"]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={2}>
              Hangi sınavın tarih müfredatı?
            </Text>
            <Pressable
              onPress={() => !examSaving && setExamPickerOpen(false)}
              style={({ pressed }) => [styles.modalCloseBtn, pressed && styles.modalClosePressed]}
              accessibilityRole="button"
              accessibilityLabel="Kapat"
              disabled={examSaving}
            >
              <Text style={styles.modalCloseText}>Kapat</Text>
            </Pressable>
          </View>
          {examListLoading ? (
            <View style={styles.examListCenter}>
              <ActivityIndicator color={colors.accent} size="large" />
            </View>
          ) : (
            <FlatList
              data={examOptions}
              keyExtractor={(item) => item.slug}
              contentContainerStyle={styles.examListContent}
              renderItem={({ item }) => {
                const active = item.slug === user?.selectedExamSlug;
                const inactive = item.isActive === false;
                return (
                  <Pressable
                    style={({ pressed }) => [
                      styles.examOption,
                      active && styles.examOptionActive,
                      pressed && styles.policyRowPressed,
                    ]}
                    onPress={() => void onPickExam(item.slug)}
                    disabled={examSaving}
                  >
                    <View style={styles.examOptionTextWrap}>
                      <Text style={styles.examOptionTitle}>{item.label}</Text>
                      {item.description ? (
                        <Text style={styles.examOptionDesc} numberOfLines={2}>
                          {item.description}
                        </Text>
                      ) : null}
                      {inactive ? (
                        <Text style={styles.examSoonBadge}>Yakında / içerik eklenince</Text>
                      ) : null}
                    </View>
                    {active ? <Ionicons name="checkmark-circle" size={22} color={colors.accent} /> : null}
                  </Pressable>
                );
              }}
            />
          )}
          {examSaving ? (
            <View style={styles.examSavingBar}>
              <ActivityIndicator color={colors.text} />
            </View>
          ) : null}
        </SafeAreaView>
      </Modal>

      <Modal
        visible={deleteAccountOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteAccountOpen(false)}
      >
        <Pressable style={styles.deleteModalBackdrop} onPress={() => setDeleteAccountOpen(false)}>
          <Pressable style={styles.deleteModalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.deleteModalTitle}>Hesabı sil</Text>
            <Text style={styles.deleteModalBody}>
              Kalıcı olarak silmek için eposta gönderiniz.
            </Text>
            <Text style={styles.deleteModalBody}>
              Talebinizi yalnızca aşağıdaki adrese iletebilirsiniz. Konu satırına «Hesap silme» yazabilirsiniz; ekibimiz
              kimlik doğrulaması sonrası işlemi tamamlar.
            </Text>
            <Text style={styles.deleteModalEmail} selectable>
              {SUPPORT_EMAIL}
            </Text>
            <Text style={styles.deleteModalHint}>
              Bu işlem geri alınamaz. Silme talebiniz yalnızca e-posta ile kabul edilir.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.deleteModalOk, pressed && { opacity: 0.9 }]}
              onPress={() => setDeleteAccountOpen(false)}
            >
              <Text style={styles.deleteModalOkText}>Tamam</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={policyOpen !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={false}
        onRequestClose={() => setPolicyOpen(null)}
      >
        <SafeAreaView style={styles.modalSafe} edges={["top", "left", "right", "bottom"]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={2}>
              {openPolicy?.title ?? ""}
            </Text>
            <Pressable
              onPress={() => setPolicyOpen(null)}
              style={({ pressed }) => [styles.modalCloseBtn, pressed && styles.modalClosePressed]}
              accessibilityRole="button"
              accessibilityLabel="Kapat"
            >
              <Text style={styles.modalCloseText}>Kapat</Text>
            </Pressable>
          </View>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator
          >
            <Text style={styles.modalBody}>{openPolicy?.body ?? ""}</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    scroll: { paddingHorizontal: 16, paddingBottom: 32 },
    section: {
      marginBottom: 20,
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    accountLabel: { color: colors.muted, fontSize: 12, fontWeight: "600", marginBottom: 6 },
    accountName: { color: colors.text, fontSize: 20, fontWeight: "800", marginBottom: 4 },
    accountMeta: { color: colors.muted, fontSize: 14 },
    examRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 14,
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    examRowText: { flex: 1, minWidth: 0, paddingRight: 10 },
    examRowLabel: { color: colors.muted, fontSize: 12, fontWeight: "600", marginBottom: 4 },
    examRowValue: { color: colors.text, fontSize: 16, fontWeight: "600", lineHeight: 22 },
    examListCenter: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    examListContent: { paddingHorizontal: 16, paddingBottom: 32 },
    examOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 12,
      marginBottom: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    examOptionActive: { borderColor: colors.accent, backgroundColor: colors.card },
    examOptionTextWrap: { flex: 1, minWidth: 0, paddingRight: 10 },
    examOptionTitle: { color: colors.text, fontSize: 16, fontWeight: "600" },
    examOptionDesc: { color: colors.muted, fontSize: 13, marginTop: 4, lineHeight: 18 },
    examSoonBadge: { color: colors.accent, fontSize: 12, fontWeight: "600", marginTop: 6 },
    examSavingBar: { paddingVertical: 12, alignItems: "center", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
    linkEmailCta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 14,
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    linkEmailCtaText: { color: colors.accent, fontSize: 16, fontWeight: "700" },
    logoutCta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 14,
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    logoutCtaText: { color: colors.muted, fontSize: 15, fontWeight: "600" },
    loginLead: {
      color: colors.muted,
      fontSize: 14,
      lineHeight: 21,
      marginBottom: 4,
    },
    guestCta: {
      marginTop: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    guestCtaText: { color: colors.text, fontSize: 16, fontWeight: "600" },
    deleteAccountBtn: { marginTop: 8, marginBottom: 24, paddingVertical: 16, alignItems: "center" },
    deleteAccountText: { color: "#e57373", fontSize: 15, fontWeight: "600" },
    deleteModalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
      justifyContent: "center",
      paddingHorizontal: 28,
    },
    deleteModalCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    deleteModalTitle: { fontSize: 18, fontWeight: "800", color: colors.text, marginBottom: 12 },
    deleteModalBody: { fontSize: 15, lineHeight: 22, color: colors.text, marginBottom: 12 },
    deleteModalEmail: { fontSize: 16, fontWeight: "700", color: colors.accent, marginBottom: 12 },
    deleteModalHint: { fontSize: 13, lineHeight: 19, color: colors.muted, marginBottom: 18 },
    deleteModalOk: {
      alignSelf: "stretch",
      backgroundColor: colors.accent,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    deleteModalOkText: { color: colors.onAccent, fontSize: 16, fontWeight: "700" },
    sectionTitle: {
      color: colors.accent,
      fontSize: 13,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 10,
    },
    sectionLead: {
      color: colors.muted,
      fontSize: 13,
      lineHeight: 19,
      marginBottom: 8,
    },
    linkRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 2,
    },
    linkRowPressed: { opacity: 0.85 },
    linkRowText: { color: colors.text, fontSize: 16, fontWeight: "600", flex: 1 },
    themeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    themeLabels: { flex: 1, minWidth: 0 },
    themeTitle: { color: colors.text, fontSize: 16, fontWeight: "600", marginBottom: 4 },
    themeHint: { color: colors.muted, fontSize: 13, lineHeight: 18 },
    appName: { color: colors.text, fontSize: 20, fontWeight: "700", marginBottom: 4 },
    version: { color: colors.muted, fontSize: 14, fontWeight: "600", marginBottom: 12 },
    body: { color: colors.text, fontSize: 15, lineHeight: 23 },
    policyRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 4,
    },
    policyRowBorder: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    policyRowPressed: { opacity: 0.85 },
    policyRowText: { flex: 1, minWidth: 0, paddingRight: 8 },
    policyRowTitle: { color: colors.text, fontSize: 16, fontWeight: "600", marginBottom: 4 },
    policyRowSummary: { color: colors.muted, fontSize: 13, lineHeight: 18 },
    modalSafe: { flex: 1, backgroundColor: colors.bg },
    modalHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      gap: 12,
    },
    modalTitle: {
      flex: 1,
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      lineHeight: 24,
    },
    modalCloseBtn: { paddingVertical: 6, paddingHorizontal: 10 },
    modalClosePressed: { opacity: 0.7 },
    modalCloseText: { color: colors.accent, fontSize: 16, fontWeight: "600" },
    modalScroll: { flex: 1 },
    modalScrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },
    modalBody: { color: colors.text, fontSize: 15, lineHeight: 24 },
  });
}
