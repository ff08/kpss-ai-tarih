import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import type { ColorPalette } from "../../constants/theme";
import { APP_TAGLINE } from "../../constants/app";
import { useTheme } from "../../contexts/ThemeContext";

export default function StatsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <ScreenHeader title="İstatistik" tagline={APP_TAGLINE} />
      <View style={styles.box}>
        <Text style={styles.lead}>Yakında</Text>
        <Text style={styles.body}>
          Burada çözdüğünüz soru sayısı, günlük seri ve konu bazlı özet gibi veriler gösterilecek. Veriler
          cihazınızda veya hesabınızda saklanacak şekilde planlanmaktadır.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    box: {
      marginHorizontal: 16,
      marginTop: 8,
      padding: 18,
      borderRadius: 14,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    lead: { color: colors.accent, fontSize: 17, fontWeight: "700", marginBottom: 10 },
    body: { color: colors.text, fontSize: 15, lineHeight: 23 },
  });
}
