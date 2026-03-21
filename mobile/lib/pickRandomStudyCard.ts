import { fetchCards, fetchSubtopics, fetchTopics, type CardKind, type StudyCard } from "./api";

export type RandomPickResult = {
  kind: CardKind;
  card: StudyCard;
  topicTitle: string;
  subtopicTitle: string;
  subtopicId: string;
};

const KINDS: CardKind[] = ["INFORMATION", "OPEN_QA", "MCQ"];

function randomItem<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Rastgele konu → alt konu → kart türü → kart seçer. Boş deck’lerde birkaç kez dener.
 */
export async function pickRandomStudyCard(maxAttempts = 48): Promise<RandomPickResult | null> {
  const topics = await fetchTopics();
  if (topics.length === 0) return null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const topic = randomItem(topics);
    if (!topic) continue;
    const { subtopics } = await fetchSubtopics(topic.id);
    const sub = randomItem(subtopics);
    if (!sub) continue;
    const kind = randomItem(KINDS)!;
    const data = await fetchCards(sub.id, kind);
    const card = randomItem(data.cards);
    if (!card) continue;
    return {
      kind,
      card,
      topicTitle: data.topicTitle,
      subtopicTitle: data.title,
      subtopicId: sub.id,
    };
  }
  return null;
}
