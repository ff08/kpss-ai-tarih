import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ColorPalette } from "../constants/theme";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  question: string;
  answer: string;
  shuffledLetters: string[];
  hint?: string | null;
  onSolved?: () => void;
};

export function WordGameCard({ question, answer, shuffledLetters, hint, onSolved }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [selected, setSelected] = useState<number[]>([]);
  const [status, setStatus] = useState<"idle" | "ok" | "wrong">("idle");
  const [showHint, setShowHint] = useState(false);
  const answerUpper = answer.toLocaleUpperCase("tr-TR");

  useEffect(() => {
    setSelected([]);
    setStatus("idle");
    setShowHint(false);
  }, [question, answerUpper]);

  const current = selected.map((i) => shuffledLetters[i] ?? "").join("");
  const solved = status === "ok";
  const slotText = Array.from({ length: answerUpper.length }, (_, i) => current[i] ?? "_").join("  ");

  const applyPick = (index: number) => {
    const next = [...selected, index];
    setSelected(next);
    const guess = next.map((i) => shuffledLetters[i] ?? "").join("");
    if (guess.length < answerUpper.length) {
      setStatus("idle");
      return;
    }
    if (guess === answerUpper) {
      setStatus("ok");
      onSolved?.();
      return;
    }
    setStatus("wrong");
  };

  const onPick = (index: number) => {
    if (solved || selected.includes(index)) return;
    applyPick(index);
  };

  const giveLetter = () => {
    if (solved) return;
    if (selected.length >= answerUpper.length) return;
    const usedSet = new Set(selected);
    const nextPos = selected.length;
    const targetChar = answerUpper[nextPos];
    const candidates: number[] = [];
    for (let i = 0; i < shuffledLetters.length; i += 1) {
      if (usedSet.has(i)) continue;
      if ((shuffledLetters[i] ?? "") === targetChar) candidates.push(i);
    }
    const fallback: number[] = [];
    for (let i = 0; i < shuffledLetters.length; i += 1) {
      if (!usedSet.has(i)) fallback.push(i);
    }
    const pool = candidates.length > 0 ? candidates : fallback;
    if (pool.length === 0) return;
    const picked = pool[Math.floor(Math.random() * pool.length)]!;
    applyPick(picked);
  };

  const resetGuess = () => {
    setSelected([]);
    setStatus("idle");
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{question}</Text>
      <View style={styles.answerBox}>
        <Text style={styles.answerText}>{slotText}</Text>
      </View>
      <View style={styles.letterGrid}>
        {shuffledLetters.map((ch, idx) => {
          const used = selected.includes(idx);
          return (
            <Pressable
              key={`${idx}-${ch}`}
              style={[styles.letter, used && styles.letterUsed]}
              disabled={used || solved}
              onPress={() => onPick(idx)}
            >
              <Text style={styles.letterText}>{ch}</Text>
            </Pressable>
          );
        })}
      </View>
      {status === "ok" ? <Text style={styles.ok}>Dogru cevap!</Text> : null}
      {status === "wrong" ? <Text style={styles.err}>Olmadi, tekrar dene.</Text> : null}
      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={resetGuess}>
          <Text style={styles.actionText}>Temizle</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setShowHint((v) => !v)}>
          <Text style={styles.actionText}>Ipucu</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={giveLetter} disabled={solved}>
          <Text style={styles.actionText}>Harf al</Text>
        </Pressable>
      </View>
      {showHint ? <Text style={styles.hint}>{hint || "Ipuclari bu kartta tanimli degil."}</Text> : null}
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
    },
    title: { color: colors.text, fontSize: 20, fontWeight: "700", lineHeight: 28 },
    answerBox: {
      marginTop: 12,
      minHeight: 52,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.bg,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
    },
    answerText: { color: colors.text, fontSize: 20, fontWeight: "700", letterSpacing: 1.6 },
    letterGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 16 },
    letter: {
      minWidth: 44,
      height: 44,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    letterUsed: { opacity: 0.4 },
    letterText: { color: colors.text, fontSize: 20, fontWeight: "700" },
    ok: { marginTop: 12, color: "#2e7d32", fontSize: 14, fontWeight: "700" },
    err: { marginTop: 12, color: "#c62828", fontSize: 14, fontWeight: "700" },
    actions: { flexDirection: "row", gap: 10, marginTop: 14 },
    actionBtn: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    actionText: { color: colors.text, fontSize: 14, fontWeight: "600" },
    hint: { marginTop: 12, color: colors.muted, fontSize: 13, lineHeight: 19 },
  });
}
