import { useMemo } from "react";
import { Alert, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import type { CardKind } from "../lib/api";
import type { ColorPalette } from "../constants/theme";
import type { StudyPathStepStatus } from "../lib/studyProgress";

const NODE = 64;
const TOP = 24;
const SEGMENT = 108;
const SECTION_TOP_GAP = 14;
const SECTION_HEADER_H = 26;
const GAP_AFTER_HEADER = 10;
/** Kart + içerik için sabit blok yüksekliği (geometri ile uyumlu). */
const TOPIC_CARD_BLOCK = 132;
/** Kart ile altındaki mod yolu (ilk düğüm) arası dikey boşluk. */
const GAP_TOPIC_CARD_TO_FLOW = 20;
/** Bir alt konunun mod yolu bittiğinde, sonraki alt konu kartından önce ek boşluk. */
const GAP_FLOW_TO_NEXT_TOPIC_CARD = 28;

const MODE_LABEL: Record<CardKind, string> = {
  INFORMATION: "Bilgi kartları",
  OPEN_QA: "Soru–cevap",
  MCQ: "Çoktan seçmeli",
  WORD_GAME: "Kelime oyunu",
};

export type StudyModePathStepPayload = {
  kind: CardKind;
  subtopicId?: number;
  subtopicTitle?: string;
};

export type StudyModePathStep = {
  kind: CardKind;
  count: number;
  status: StudyPathStepStatus;
  subtopicId?: number;
  subtopicTitle?: string;
};

export type StudyModeTopicSection = {
  subtopicId: number;
  title: string;
  description: string;
  locked: boolean;
  /** Kilit açıkken sağda gösterilir; yoksa veya kilitliyken gösterilmez. */
  characterImage?: ImageSourcePropType | null;
  steps: StudyModePathStep[];
};

type Props = {
  width: number;
  colors: ColorPalette;
  onPressStep: (payload: StudyModePathStepPayload) => void;
  /** Alt konu ekranı: tek alt konunun modları */
  steps?: StudyModePathStep[];
  /** Konu ekranı: her alt konu için kart + modlar */
  topicSections?: StudyModeTopicSection[];
};

function nodeCenterX(i: number, innerW: number, pad: number): number {
  const frac = [0.2, 0.52, 0.8, 0.48];
  return pad + frac[i % 4] * innerW;
}

function cubicPath(x0: number, y0: number, x1: number, y1: number): string {
  const midY = (y0 + y1) / 2;
  return `M ${x0} ${y0} C ${x0} ${midY}, ${x1} ${midY}, ${x1} ${y1}`;
}

function segmentColor(
  toStatus: StudyPathStepStatus,
  colors: ColorPalette,
): string {
  if (toStatus === "locked") return colors.border;
  if (toStatus === "active") return colors.accent;
  return colors.mcqCorrectBorder;
}

function useSubtopicPathGeometry(steps: StudyModePathStep[], innerW: number, pad: number) {
  return useMemo(() => {
    const showSections = steps.length > 0 && steps[0].subtopicId != null;
    let yCursor = TOP;
    const centers: { x: number; y: number }[] = [];
    const headers: { top: number; title: string }[] = [];

    for (let i = 0; i < steps.length; i++) {
      const newSection =
        showSections && (i === 0 || steps[i].subtopicId !== steps[i - 1].subtopicId);
      if (newSection) {
        if (i > 0) yCursor += SECTION_TOP_GAP;
        headers.push({ top: yCursor, title: steps[i].subtopicTitle ?? "" });
        yCursor += SECTION_HEADER_H + GAP_AFTER_HEADER;
      }
      centers.push({
        x: nodeCenterX(i, innerW, pad),
        y: yCursor + NODE / 2,
      });
      yCursor += SEGMENT;
    }

    const pathHeight = yCursor + 28;
    const pathDs: string[] = [];
    for (let i = 0; i < centers.length - 1; i++) {
      pathDs.push(cubicPath(centers[i].x, centers[i].y, centers[i + 1].x, centers[i + 1].y));
    }

    return { centers, pathHeight, pathDs, headers, showSections };
  }, [steps, innerW, pad]);
}

function useTopicSectionsGeometry(sections: StudyModeTopicSection[], innerW: number, pad: number) {
  return useMemo(() => {
    let yCursor = TOP;
    const centers: { x: number; y: number }[] = [];
    const cards: Array<{ top: number; section: StudyModeTopicSection }> = [];
    let globalIndex = 0;

    for (let si = 0; si < sections.length; si++) {
      const sec = sections[si];
      cards.push({ top: yCursor, section: sec });
      yCursor += TOPIC_CARD_BLOCK + GAP_TOPIC_CARD_TO_FLOW;

      for (let j = 0; j < sec.steps.length; j++) {
        centers.push({
          x: nodeCenterX(globalIndex, innerW, pad),
          y: yCursor + NODE / 2,
        });
        globalIndex++;
        yCursor += SEGMENT;
      }
      if (sec.steps.length === 0) {
        yCursor += 12;
      }

      if (si < sections.length - 1) {
        yCursor += GAP_FLOW_TO_NEXT_TOPIC_CARD;
      }
    }

    const flatSteps = sections.flatMap((s) => s.steps);
    const pathHeight = yCursor + 28;

    /** Sadece aynı alt konu içindeki ardışık düğümler birbirine bağlanır. */
    const pathSegments: { d: string; toIndex: number }[] = [];
    for (let i = 0; i < centers.length - 1; i++) {
      const a = flatSteps[i];
      const b = flatSteps[i + 1];
      if (!a || !b || a.subtopicId !== b.subtopicId) continue;
      pathSegments.push({
        d: cubicPath(centers[i].x, centers[i].y, centers[i + 1].x, centers[i + 1].y),
        toIndex: i + 1,
      });
    }

    return { centers, pathHeight, pathSegments, cards, flatSteps };
  }, [sections, innerW, pad]);
}

export function StudyModePath(props: Props) {
  if (props.topicSections !== undefined) {
    return <TopicSectionsPath {...props} sections={props.topicSections} />;
  }
  return <SubtopicStepsOnlyPath {...props} />;
}

function SubtopicStepsOnlyPath(props: Props) {
  const { width, colors, onPressStep, steps: stepsProp } = props;
  const pad = 20;
  const innerW = width - pad * 2;
  const steps = stepsProp ?? [];
  const { centers, pathHeight, pathDs, headers, showSections } = useSubtopicPathGeometry(steps, innerW, pad);

  if (steps.length === 0) return null;

  return (
    <View style={[styles.wrap, { width, minHeight: pathHeight, overflow: "visible" }]}>
      <Svg
        width={width}
        height={pathHeight}
        style={[StyleSheet.absoluteFill, styles.pathSvgLayer]}
        pointerEvents="none"
      >
        {pathDs.map((d, i) => {
          const toStatus = steps[i + 1]?.status ?? "locked";
          return (
            <Path
              key={`seg-${i}`}
              d={d}
              stroke={segmentColor(toStatus, colors)}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              opacity={toStatus === "locked" ? 0.45 : 1}
            />
          );
        })}
      </Svg>

      {showSections
        ? headers.map((h, hi) => (
            <View
              key={`hdr-${hi}`}
              style={[styles.sectionHeader, { top: h.top, paddingHorizontal: pad, zIndex: 2 }]}
            >
              <Text style={[styles.sectionEyebrow, { color: colors.muted }]}>Alt konu</Text>
              <Text style={[styles.sectionTitle, { color: colors.text }]} numberOfLines={2}>
                {h.title}
              </Text>
            </View>
          ))
        : null}

      {steps.map((step, i) => (
        <PathNode
          key={`${step.subtopicId ?? "s"}-${step.kind}-${i}`}
          step={step}
          cx={centers[i].x}
          cy={centers[i].y}
          colors={colors}
          onPressStep={onPressStep}
          zIndex={3}
        />
      ))}
    </View>
  );
}

function TopicSectionsPath(
  props: Props & { sections: StudyModeTopicSection[] },
) {
  const { width, colors, onPressStep, sections } = props;
  const pad = 20;
  const innerW = width - pad * 2;
  const { centers, pathHeight, pathSegments, cards, flatSteps } = useTopicSectionsGeometry(sections, innerW, pad);

  return (
    <View style={[styles.wrap, { width, minHeight: pathHeight, overflow: "visible" }]}>
      {pathSegments.length > 0 ? (
        <Svg
          width={width}
          height={pathHeight}
          style={[StyleSheet.absoluteFill, styles.pathSvgLayer]}
          pointerEvents="none"
        >
          {pathSegments.map((seg) => {
            const toStatus = flatSteps[seg.toIndex]?.status ?? "locked";
            return (
              <Path
                key={`seg-${seg.toIndex}`}
                d={seg.d}
                stroke={segmentColor(toStatus, colors)}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                opacity={toStatus === "locked" ? 0.45 : 1}
              />
            );
          })}
        </Svg>
      ) : null}

      {cards.map(({ top, section }) => {
        const showCharacter = !section.locked && section.characterImage != null;
        return (
          <View
            key={`card-${section.subtopicId}`}
            style={[
              styles.topicCard,
              {
                top,
                left: pad,
                right: pad,
                backgroundColor: colors.card,
                borderColor: colors.border,
                zIndex: 2,
                paddingRight: showCharacter ? 108 : 14,
              },
              section.locked && styles.topicCardLocked,
            ]}
          >
            {section.locked ? (
              <View style={[styles.topicCardLock, { backgroundColor: colors.surface, zIndex: 4 }]}>
                <Ionicons name="lock-closed" size={20} color={colors.muted} />
              </View>
            ) : null}
            <Text style={[styles.topicCardEyebrow, { color: colors.muted }]}>Alt konu</Text>
            <Text style={[styles.topicCardTitle, { color: colors.text }]} numberOfLines={2}>
              {section.title}
            </Text>
            <Text style={[styles.topicCardDesc, { color: colors.muted }]} numberOfLines={4}>
              {section.description}
            </Text>
            {showCharacter ? (
              <Image
                source={section.characterImage!}
                style={styles.topicCardCharacter}
                contentFit="contain"
                accessibilityIgnoresInvertColors
              />
            ) : null}
          </View>
        );
      })}

      {flatSteps.map((step, i) => (
        <PathNode
          key={`${step.subtopicId}-${step.kind}-${i}`}
          step={step}
          cx={centers[i].x}
          cy={centers[i].y}
          colors={colors}
          onPressStep={onPressStep}
          zIndex={4}
        />
      ))}
    </View>
  );
}

function PathNode({
  step,
  cx,
  cy,
  colors,
  onPressStep,
  zIndex = 1,
}: {
  step: StudyModePathStep;
  cx: number;
  cy: number;
  colors: ColorPalette;
  onPressStep: (payload: StudyModePathStepPayload) => void;
  zIndex?: number;
}) {
  const left = cx - NODE / 2;
  const top = cy - NODE / 2;
  const isSparkle = step.status === "active";

  return (
    <View style={[styles.nodeAnchor, { left, top, width: NODE, height: NODE, zIndex }]}>
      {isSparkle ? (
        <>
          <Text style={[styles.sparkle, styles.s1, { color: colors.accent }]}>✦</Text>
          <Text style={[styles.sparkle, styles.s2, { color: colors.mcqCorrectBorder }]}>✦</Text>
          <Text style={[styles.sparkle, styles.s3, { color: colors.accent }]}>✦</Text>
        </>
      ) : null}
      <Pressable
        onPress={() => {
          if (step.status === "locked") {
            Alert.alert("Kilitli adım", "Önce önceki adımı veya sıradaki alt konuyu tamamlayın.");
            return;
          }
          onPressStep({
            kind: step.kind,
            subtopicId: step.subtopicId,
            subtopicTitle: step.subtopicTitle,
          });
        }}
        style={({ pressed }) => [
          styles.nodeOuter,
          { backgroundColor: colors.surface, borderColor: colors.border },
          step.status === "completed" && { borderColor: colors.mcqCorrectBorder, backgroundColor: colors.mcqCorrectBg },
          step.status === "active" && {
            borderColor: colors.accent,
            backgroundColor: colors.surface,
            shadowColor: colors.accent,
            shadowOpacity: 0.55,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 0 },
            elevation: 8,
          },
          step.status === "locked" && styles.nodeLocked,
          pressed && step.status !== "locked" && { opacity: 0.92 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${MODE_LABEL[step.kind]}, ${step.status === "locked" ? "kilitli" : step.status === "active" ? "sırada" : "tamamlandı"}`}
      >
        {step.status === "completed" ? (
          <View style={[styles.doneBadge, { backgroundColor: colors.mcqCorrectBorder }]}>
            <Ionicons name="checkmark" size={14} color="#ffffff" />
          </View>
        ) : null}
        {step.status === "locked" ? (
          <Ionicons name="lock-closed" size={28} color={colors.muted} />
        ) : step.kind === "MCQ" ? (
          <Text style={[styles.abcd, { color: step.status === "active" ? colors.accent : colors.mcqCorrectBorder }]}>A B C D</Text>
        ) : step.kind === "INFORMATION" ? (
          <Ionicons name="albums-outline" size={30} color={step.status === "active" ? colors.accent : colors.mcqCorrectBorder} />
        ) : step.kind === "OPEN_QA" ? (
          <Ionicons name="chatbubbles-outline" size={28} color={step.status === "active" ? colors.accent : colors.mcqCorrectBorder} />
        ) : (
          <Ionicons name="extension-puzzle-outline" size={28} color={step.status === "active" ? colors.accent : colors.mcqCorrectBorder} />
        )}
      </Pressable>
      <Text style={[styles.caption, { color: step.status === "locked" ? colors.muted : colors.text }]} numberOfLines={2}>
        {MODE_LABEL[step.kind]}
      </Text>
      <Text style={[styles.countMeta, { color: colors.muted }]}>{step.count} kart</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "relative" },
  pathSvgLayer: { zIndex: 0 },
  topicCard: {
    position: "absolute",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: TOPIC_CARD_BLOCK,
    overflow: "visible",
    elevation: 4,
  },
  /** Sağ kenar + dikey orta (100px yükseklik için -50 offset). */
  /** Daha büyük, kartın sağ-üstüne taşır; marginTop ile yukarı kaydırılmış merkez (derinlik). */
  topicCardCharacter: {
    position: "absolute",
    right: -18,
    top: "50%",
    marginTop: -82,
    width: 128,
    height: 128,
    zIndex: 5,
    backgroundColor: "transparent",
    shadowColor: "#000000",
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  topicCardLocked: {
    opacity: 0.72,
  },
  topicCardLock: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  topicCardEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  topicCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
    paddingRight: 8,
  },
  topicCardDesc: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeader: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  nodeAnchor: { position: "absolute", alignItems: "center" },
  nodeOuter: {
    width: NODE,
    height: NODE,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  nodeLocked: {
    opacity: 0.55,
  },
  doneBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  abcd: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  caption: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    maxWidth: NODE + 36,
  },
  countMeta: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "600",
  },
  sparkle: {
    position: "absolute",
    fontSize: 12,
    opacity: 0.85,
    zIndex: 0,
  },
  s1: { top: -14, right: -8 },
  s2: { bottom: -10, left: -12 },
  s3: { top: 8, left: -18 },
});
