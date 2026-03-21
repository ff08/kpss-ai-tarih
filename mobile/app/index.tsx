import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../components/ScreenHeader";
import type { ColorPalette } from "../constants/theme";
import { useTheme } from "../contexts/ThemeContext";
import { APP_TAGLINE } from "../constants/app";
import { getTimeOfDayGreeting } from "../lib/greeting";
import { fetchTopics, type Topic } from "../lib/api";

export default function TopicsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState(() => getTimeOfDayGreeting());

  useEffect(() => {
    setGreeting(getTimeOfDayGreeting());
    const id = setInterval(() => setGreeting(getTimeOfDayGreeting()), 60_000);
    return () => clearInterval(id);
  }, []);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const t = await fetchTopics();
      setTopics(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && topics.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ScreenHeader title="KPSS AI Tarih" aboveTitle={greeting} tagline={APP_TAGLINE} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.muted}>Konular yükleniyor…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ScreenHeader title="KPSS AI Tarih" aboveTitle={greeting} tagline={APP_TAGLINE} />
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Bağlantı hatası</Text>
          <Text style={styles.muted}>{error}</Text>
          <Text style={styles.hint}>
            API&apos;nin çalıştığından emin olun (ör. `npm run dev` api klasöründe). Android emülatörde
            bilgisayarınızdaki API için 10.0.2.2:3000 kullanılır.
          </Text>
          <Pressable style={styles.retry} onPress={() => void load()}>
            <Text style={styles.retryText}>Yeniden dene</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <ScreenHeader title="KPSS AI Tarih" aboveTitle={greeting} tagline={APP_TAGLINE} />
      <FlatList
        style={styles.listFlex}
        data={topics}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void load()} tintColor={colors.accent} />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => router.push(`/topic/${item.id}`)}
          >
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              {item.description ? <Text style={styles.rowDesc}>{item.description}</Text> : null}
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    listFlex: { flex: 1 },
    list: { paddingHorizontal: 16, paddingBottom: 24 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    rowPressed: { opacity: 0.92 },
    rowTextCol: { flex: 1, minWidth: 0, paddingRight: 12 },
    rowTitle: { color: colors.text, fontSize: 16, fontWeight: "600", lineHeight: 22 },
    rowDesc: {
      color: colors.muted,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 5,
    },
    chevron: { color: colors.muted, fontSize: 22, fontWeight: "300" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: colors.bg },
    muted: { color: colors.muted, marginTop: 12, textAlign: "center", lineHeight: 20 },
    errorTitle: { color: colors.text, fontSize: 18, fontWeight: "600" },
    hint: { color: colors.muted, marginTop: 16, textAlign: "center", lineHeight: 20, fontSize: 13 },
    retry: {
      marginTop: 20,
      backgroundColor: colors.accent,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 10,
    },
    retryText: { color: colors.onAccent, fontWeight: "600" },
  });
}
