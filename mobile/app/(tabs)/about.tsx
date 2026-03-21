import { useMemo } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import type { ColorPalette } from "../../constants/theme";
import { APP_TAGLINE } from "../../constants/app";
import { useTheme } from "../../contexts/ThemeContext";

function appVersion(): string {
  const v = Constants.expoConfig?.version ?? (Constants as { nativeAppVersion?: string }).nativeAppVersion;
  return v ?? "1.0.0";
}

export default function AboutScreen() {
  const { colors, mode, setMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const version = appVersion();

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <ScreenHeader title="Hakkında" tagline={APP_TAGLINE} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama</Text>
          <Text style={styles.appName}>KPSS AI Tarih</Text>
          <Text style={styles.version}>Sürüm {version}</Text>
          <Text style={styles.body}>
            KPSS Genel Yetenek Tarih müfredatına uygun bilgi kartları, soru–cevap ve çoktan seçmeli sorularla
            tekrar yapmanız için tasarlanmıştır. Konuları sırayla çalışabilir veya rastgele modda kendinizi
            test edebilirsiniz.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genel bilgiler</Text>
          <Text style={styles.body}>
            Bu uygulama eğitim amaçlıdır; resmi sınav kaynağı değildir. İçerikler müfredat çerçevesinde
            özetlenmiştir. Güncel mevzuat ve sınav kılavuzu için ÖSYM&apos;yi takip edin.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gizlilik</Text>
          <Text style={styles.body}>
            Uygulama şu an için hesap veya kişisel veri toplamadan çalışır; yalnızca cihazınız API adresi
            üzerinden içerik sunucusuna bağlanır. İleride hesap veya analitik eklenirse bu bölüm ve ayrı bir
            gizlilik politikası güncellenecektir.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kullanım</Text>
          <Text style={styles.body}>
            İçerikleri yalnızca kişisel çalışmanız için kullanın; ticari çoğaltma yapılmamalıdır. API veya
            uygulama üzerinden otomatik toplu indirme (scraping) yapılmamalıdır.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    scroll: { paddingHorizontal: 16, paddingBottom: 32 },
    section: {
      marginBottom: 24,
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      color: colors.accent,
      fontSize: 13,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 10,
    },
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
  });
}
