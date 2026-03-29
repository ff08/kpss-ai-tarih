import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
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
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

function appVersion(): string {
  const v = Constants.expoConfig?.version ?? (Constants as { nativeAppVersion?: string }).nativeAppVersion;
  return v ?? "1.0.0";
}

export default function AboutScreen() {
  const router = useRouter();
  const { user, premium, refreshUser, token } = useAuth();
  const { colors, mode, setMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const version = appVersion();
  const [policyOpen, setPolicyOpen] = useState<PolicyId | null>(null);

  const openPolicy = policyOpen ? ABOUT_POLICIES[policyOpen] : null;

  useFocusEffect(
    useCallback(() => {
      if (token) void refreshUser();
    }, [token, refreshUser]),
  );

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
          </View>
        ) : null}

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
      </ScrollView>

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
