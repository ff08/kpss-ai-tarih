import type { ImageSourcePropType } from "react-native";

/** PNG’ler `assets/topic-path/` altında; alfa kanallı (şeffaf arka plan). Yeniden üretmek için: `npm run process-characters` */
/** Bu konu ID’leri için (route `topicId`) ilk dört alt konuya sırayla karakter atanır. */
const TOPIC_IDS_WITH_CHARACTERS = new Set(["1"]);

const UNIT1_CHARACTERS: ImageSourcePropType[] = [
  require("../assets/topic-path/unit1-char-0.png"),
  require("../assets/topic-path/unit1-char-1.png"),
  require("../assets/topic-path/unit1-char-2.png"),
  require("../assets/topic-path/unit1-char-3.png"),
];

/**
 * Konu çalışma yolunda alt konu kartı için sağda gösterilecek karakter.
 * Sadece kilit açıldığında (unlocked) gösterilir.
 */
export function characterImageForTopicSubtopic(
  topicId: string,
  sortedSubtopicIndex: number,
): ImageSourcePropType | null {
  if (!TOPIC_IDS_WITH_CHARACTERS.has(topicId)) return null;
  if (sortedSubtopicIndex < 0 || sortedSubtopicIndex >= UNIT1_CHARACTERS.length) return null;
  return UNIT1_CHARACTERS[sortedSubtopicIndex];
}
