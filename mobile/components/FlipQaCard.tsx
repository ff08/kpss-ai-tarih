import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MdText } from "./MdText";
import { colors } from "../constants/theme";

type Props = {
  question: string;
  answer: string;
  /** Kart değişince ön yüze dön */
  resetKey: string;
};

export function FlipQaCard({ question, answer, resetKey }: Props) {
  const spin = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
    spin.setValue(0);
  }, [resetKey, spin]);

  const toggle = () => {
    const next = !flipped;
    setFlipped(next);
    Animated.spring(spin, {
      toValue: next ? 1 : 0,
      friction: 8,
      tension: 48,
      useNativeDriver: true,
    }).start();
  };

  const frontRotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const backRotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <Pressable style={styles.press} onPress={toggle} accessibilityRole="button">
      <View style={styles.stage}>
        <Animated.View
          style={[
            styles.face,
            styles.front,
            {
              transform: [{ perspective: 1200 }, { rotateY: frontRotate }],
            },
          ]}
        >
          <Text style={styles.faceLabel}>Soru</Text>
          <Text style={styles.question}>{question}</Text>
          <Text style={styles.hint}>Cevabı görmek için dokunun</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.face,
            styles.back,
            {
              transform: [{ perspective: 1200 }, { rotateY: backRotate }],
            },
          ]}
        >
          <Text style={styles.faceLabel}>Cevap</Text>
          <ScrollView style={styles.answerScroll} contentContainerStyle={styles.answerScrollContent} showsVerticalScrollIndicator={false}>
            <MdText style={styles.answer}>{answer}</MdText>
          </ScrollView>
          <Text style={styles.hint}>Soruya dönmek için dokunun</Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { flex: 1 },
  stage: {
    flex: 1,
    position: "relative",
  },
  face: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    backfaceVisibility: "hidden",
    justifyContent: "center",
  },
  front: {},
  back: { justifyContent: "flex-start" },
  faceLabel: {
    position: "absolute",
    top: 16,
    left: 20,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  question: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
    marginTop: 8,
  },
  answerScroll: {
    flex: 1,
    marginTop: 28,
    marginBottom: 40,
  },
  answerScrollContent: { paddingBottom: 8 },
  answer: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  hint: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    color: colors.muted,
    fontSize: 12,
  },
});
