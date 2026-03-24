import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "kpss_mcq_answers_v1";

export type McqAnswerMap = Record<string, number>;

function cardKey(subtopicId: number, cardId: string | number): string {
  return `${subtopicId}:${String(cardId)}`;
}

export async function loadMcqAnswers(): Promise<McqAnswerMap> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as McqAnswerMap;
  } catch {
    return {};
  }
}

export async function saveMcqAnswer(subtopicId: number, cardId: string | number, selectedIndex: number): Promise<void> {
  const map = await loadMcqAnswers();
  map[cardKey(subtopicId, cardId)] = selectedIndex;
  await AsyncStorage.setItem(KEY, JSON.stringify(map));
}

export function getMcqAnswerFromMap(
  map: McqAnswerMap,
  subtopicId: number,
  cardId: string | number,
): number | null {
  const v = map[cardKey(subtopicId, cardId)];
  return Number.isInteger(v) ? v : null;
}
