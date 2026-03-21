import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { parseMcqPayload, type QuestionDifficulty, type StudyCard } from "../lib/api";
import type { ColorPalette } from "../constants/theme";
import { useTheme } from "../contexts/ThemeContext";

function DifficultyBadge({ level }: { level: QuestionDifficulty }) {
  const { colors } = useTheme();
  const u = useMemo(() => {
    const map: Record<QuestionDifficulty, { label: string; bg: string; fg: string }> = {
      EASY: { label: "Kolay", bg: colors.difficultyEasyBg, fg: colors.difficultyEasy },
      MEDIUM: { label: "Orta", bg: colors.difficultyMediumBg, fg: colors.difficultyMedium },
      HARD: { label: "Zor", bg: colors.difficultyHardBg, fg: colors.difficultyHard },
    };
    return map[level];
  }, [colors, level]);
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: u.bg,
        borderColor: u.fg,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: "700", letterSpacing: 0.3, color: u.fg }}>{u.label}</Text>
    </View>
  );
}

export function McqSlide({
  item,
  isActive,
  timeUp,
  onAnswer,
}: {
  item: StudyCard;
  isActive: boolean;
  timeUp: boolean;
  onAnswer: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createMcqSlideStyles(colors), [colors]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [item.id]);

  useEffect(() => {
    if (!isActive) setSelected(null);
  }, [isActive]);

  let payload: ReturnType<typeof parseMcqPayload>;
  try {
    payload = parseMcqPayload(item.content);
  } catch {
    return (
      <View style={styles.card}>
        <Text style={styles.error}>Çoktan seçmeli verisi okunamadı</Text>
      </View>
    );
  }

  const showReveal = isActive && (selected !== null || timeUp);
  const correctLetter = String.fromCharCode(65 + payload.correctIndex);
  const correctOptionText = payload.options[payload.correctIndex];

  let feedback: string | null = null;
  if (showReveal) {
    if (selected !== null && selected === payload.correctIndex) {
      feedback = "Doğru";
    } else if (selected !== null && selected !== payload.correctIndex) {
      feedback = `Yanlış. Doğru şık: ${correctLetter}) ${correctOptionText}`;
    } else if (selected === null && timeUp) {
      feedback = `Süre doldu. Doğru şık: ${correctLetter}) ${correctOptionText}`;
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.mcqTagsRow}>
        {item.tag ? (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
        ) : null}
        {item.difficulty ? <DifficultyBadge level={item.difficulty} /> : null}
      </View>
      <Text style={styles.mcqCardTitle}>{item.title}</Text>
      <ScrollView
        style={styles.mcqOptionsScroll}
        contentContainerStyle={styles.mcqList}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        {payload.options.map((opt, i) => {
          const correct = i === payload.correctIndex;
          const isSel = selected === i;
          const locked = timeUp || selected !== null;
          return (
            <Pressable
              key={i}
              onPress={() => {
                if (!isActive || locked) return;
                setSelected(i);
                onAnswer();
              }}
              style={[
                styles.option,
                showReveal && correct && styles.optionCorrect,
                showReveal && isSel && !correct && selected !== null && styles.optionWrong,
              ]}
            >
              <Text style={styles.optionLetter}>{String.fromCharCode(65 + i)}.</Text>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionText} maxFontSizeMultiplier={1.2}>
                  {opt}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      {feedback ? <Text style={styles.mcqFeedback}>{feedback}</Text> : null}
    </View>
  );
}

function createMcqSlideStyles(colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      maxHeight: "100%",
    },
    mcqTagsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
    tag: {
      alignSelf: "flex-start",
      backgroundColor: colors.tagBg,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    tagText: { color: colors.accent, fontSize: 12, fontWeight: "600" },
    mcqCardTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 14,
      lineHeight: 28,
      flexShrink: 0,
    },
    mcqOptionsScroll: { flex: 1, minHeight: 0 },
    mcqList: { paddingBottom: 12, gap: 10 },
    option: {
      flexDirection: "column",
      alignItems: "stretch",
      alignSelf: "stretch",
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionCorrect: { borderColor: colors.mcqCorrectBorder, backgroundColor: colors.mcqCorrectBg },
    optionWrong: { borderColor: colors.mcqWrongBorder, backgroundColor: colors.mcqWrongBg },
    optionLetter: {
      color: colors.accent,
      fontWeight: "700",
      marginBottom: 6,
      alignSelf: "flex-start",
    },
    optionTextWrap: {
      alignSelf: "stretch",
      width: "100%",
      minWidth: 0,
    },
    optionText: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
      flexShrink: 1,
      minWidth: 0,
    },
    mcqFeedback: { marginTop: 12, color: colors.muted, fontSize: 13, textAlign: "center", flexShrink: 0 },
    error: { color: colors.muted, padding: 24, textAlign: "center" },
  });
}
