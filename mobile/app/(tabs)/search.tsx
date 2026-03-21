import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "../../components/ScreenHeader";
import type { ColorPalette } from "../../constants/theme";
import { APP_TAGLINE } from "../../constants/app";
import { useTheme } from "../../contexts/ThemeContext";
import { fetchTopics, type Topic } from "../../lib/api";

function normalize(s: string): string {
  return s.toLocaleLowerCase("tr").trim();
}

export default function SearchScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

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

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return topics;
    return topics.filter((t) => {
      const title = normalize(t.title);
      const desc = t.description ? normalize(t.description) : "";
      return title.includes(q) || desc.includes(q);
    });
  }, [topics, query]);

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <ScreenHeader title="Arama" tagline={APP_TAGLINE} />
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color={colors.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Konu veya açıklama ara…"
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>
      {loading && topics.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.retry} onPress={() => void load()}>
            <Text style={styles.retryText}>Yeniden dene</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          style={styles.listFlex}
          data={filtered}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void load()} tintColor={colors.accent} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {query.trim() ? "Eşleşen konu yok." : "Konu yok."}
            </Text>
          }
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
      )}
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 16,
      marginBottom: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    searchIcon: { marginRight: 8 },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      paddingVertical: 4,
      minHeight: 36,
    },
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
    rowDesc: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 5 },
    chevron: { color: colors.muted, fontSize: 22, fontWeight: "300" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    error: { color: colors.muted, textAlign: "center" },
    retry: {
      marginTop: 16,
      backgroundColor: colors.accent,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 10,
    },
    retryText: { color: colors.onAccent, fontWeight: "600" },
    empty: { color: colors.muted, textAlign: "center", padding: 24 },
  });
}
