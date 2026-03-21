import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchCards, type InformationCard } from "../../lib/api";
import { MdText } from "../../components/MdText";
import { colors } from "../../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CardDeckScreen() {
  const { subtopicId } = useLocalSearchParams<{ subtopicId: string }>();
  const [topicTitle, setTopicTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [cards, setCards] = useState<InformationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<InformationCard>>(null);

  const load = useCallback(async () => {
    if (!subtopicId) return;
    setError(null);
    setLoading(true);
    try {
      const data = await fetchCards(subtopicId);
      setTopicTitle(data.topicTitle);
      setSubTitle(data.title);
      setCards(data.cards);
      setIndex(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [subtopicId]);

  useEffect(() => {
    void load();
  }, [load]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setIndex(viewableItems[0].index);
    }
  }, []);

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;

  if (loading && cards.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (cards.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: subTitle || "Bilgi kartları" }} />
        <SafeAreaView style={styles.safe} edges={["bottom"]}>
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>Henüz içerik yok</Text>
            <Text style={styles.emptySub}>
              Bu alt konu için veritabanında bilgi kartı bulunmuyor. İçerik ekledikten sonra tekrar deneyin.
            </Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: subTitle || "Bilgi kartları" }} />
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <Text style={styles.breadcrumb} numberOfLines={1}>
          {topicTitle}
        </Text>
        <View style={styles.pagerMeta}>
          <Text style={styles.counter}>
            {index + 1} / {cards.length}
          </Text>
        </View>
        <FlatList
          ref={listRef}
          data={cards}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfig}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={() => void load()} tintColor={colors.accent} />
          }
          getItemLayout={(_, i) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * i,
            index: i,
          })}
          renderItem={({ item }) => (
            <View style={[styles.page, { width: SCREEN_WIDTH }]}>
              <View style={styles.card}>
                {item.tag ? (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.tag}</Text>
                  </View>
                ) : null}
                <Text style={styles.cardTitle}>{item.title}</Text>
                <MdText style={styles.cardBody}>{item.content}</MdText>
              </View>
            </View>
          )}
        />
        <Text style={styles.swipeHint}>Yatay kaydırarak ileri ve geri gidebilirsiniz</Text>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  breadcrumb: {
    color: colors.muted,
    fontSize: 13,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  pagerMeta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  counter: { color: colors.accent, fontSize: 13, fontWeight: "600" },
  page: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    justifyContent: "center",
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: "88%",
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: colors.tagBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  tagText: { color: colors.accent, fontSize: 12, fontWeight: "600" },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
    lineHeight: 28,
  },
  cardBody: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  swipeHint: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg },
  error: { color: colors.muted, padding: 24, textAlign: "center" },
  emptyWrap: { flex: 1, justifyContent: "center", padding: 28 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "600", marginBottom: 10 },
  emptySub: { color: colors.muted, lineHeight: 22, fontSize: 15 },
});
