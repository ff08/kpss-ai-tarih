import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ColorPalette } from "../constants/theme";
import type { RankProgressState } from "../hooks/useRankProgress";
import type { MergedRankDef } from "../lib/rankDefinitions";
import { RankCard } from "./RankCard";

const sliderStyles = StyleSheet.create({
  wrap: { marginBottom: 8 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  pageLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 2,
    textAlign: "center",
  },
});

type Props = {
  rankState: RankProgressState;
  mergedRanks: MergedRankDef[];
  colors: ColorPalette;
  /** `FlatList` içerik genişliği ile aynı: ekran - yatay padding */
  slideWidth: number;
};

const MAX_DOTS = 12;

export function RankCardSlider({ rankState, mergedRanks, colors, slideWidth }: Props) {
  const [page, setPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const s = sliderStyles;

  const { completedUnitCount, maxLevel, nextRank } = rankState;
  const allDone = maxLevel > 0 && completedUnitCount >= maxLevel;

  /** Soldan sağa: eski → yeni rütbe; en sonda (varsa) kilitli sıradaki. */
  const earnedRanks = useMemo(() => {
    const n = Math.min(completedUnitCount, mergedRanks.length);
    return mergedRanks.slice(0, n);
  }, [mergedRanks, completedUnitCount]);

  const showLockedSlide = !allDone && nextRank != null;
  const totalSlides = earnedRanks.length + (showLockedSlide ? 1 : 0);

  /** Mevcut seviye = kronolojik dizide son kazanılan (eskiler solda; kilit sağda kalır). */
  const activeSlideIndex = useMemo(() => {
    if (totalSlides <= 0) return 0;
    if (earnedRanks.length === 0) return 0;
    return Math.min(earnedRanks.length - 1, totalSlides - 1);
  }, [totalSlides, earnedRanks.length]);

  useEffect(() => {
    if (totalSlides <= 0 || slideWidth <= 0) return;
    const x = activeSlideIndex * slideWidth;
    setPage(activeSlideIndex);
    const id = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x, animated: false });
    });
    return () => cancelAnimationFrame(id);
  }, [activeSlideIndex, slideWidth, totalSlides]);

  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (totalSlides <= 0 || slideWidth <= 0) return;
      const x = e.nativeEvent.contentOffset.x;
      const i = Math.round(x / slideWidth);
      setPage(Math.max(0, Math.min(totalSlides - 1, i)));
    },
    [slideWidth, totalSlides],
  );

  const showDotRow = totalSlides > 0 && totalSlides <= MAX_DOTS;
  const showPageLabel = totalSlides > MAX_DOTS;

  if (totalSlides === 0) {
    const fallback = mergedRanks[0] ?? null;
    return (
      <View style={s.wrap}>
        <RankCard rankState={rankState} displayRank={fallback} colors={colors} style={{ marginBottom: 0 }} />
      </View>
    );
  }

  return (
    <View style={s.wrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        nestedScrollEnabled
        scrollEventThrottle={16}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
        contentContainerStyle={{ width: slideWidth * totalSlides }}
      >
        {earnedRanks.map((def) => (
          <View key={`earned-${def.level}`} style={{ width: slideWidth }}>
            <RankCard
              rankState={rankState}
              displayRank={def}
              colors={colors}
              style={{ marginBottom: 0 }}
              hideProgressBar
              levelLineOverride={`Seviye ${def.level} / ${maxLevel}`}
              footerHint="earned"
            />
          </View>
        ))}
        {showLockedSlide && nextRank ? (
          <View style={{ width: slideWidth }}>
            <RankCard
              rankState={rankState}
              displayRank={nextRank}
              colors={colors}
              style={{ marginBottom: 0 }}
              hideProgressBar
              locked
              levelLineOverride={`Seviye ${nextRank.level} / ${maxLevel}`}
              footerHint="locked"
            />
          </View>
        ) : null}
      </ScrollView>
      {showPageLabel ? (
        <Text style={[s.pageLabel, { color: colors.muted }]}>
          {page + 1} / {totalSlides}
        </Text>
      ) : showDotRow ? (
        <View style={s.dots}>
          {Array.from({ length: totalSlides }, (_, i) => (
            <View
              key={i}
              style={[s.dot, { backgroundColor: page === i ? colors.accent : colors.border }]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
