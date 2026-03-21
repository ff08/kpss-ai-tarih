import { getDefaultApiBase } from "./config";

const base = () => getDefaultApiBase();

export type Topic = {
  id: string;
  title: string;
  sortOrder: number;
  description?: string | null;
  subtopicCount: number;
  informationCount: number;
  openQaCount: number;
  mcqCount: number;
};

export type Subtopic = { id: string; title: string; sortOrder: number };

export type CardKind = "INFORMATION" | "OPEN_QA" | "MCQ";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";

export type StudyCard = {
  id: string;
  kind: CardKind;
  difficulty: QuestionDifficulty | null;
  title: string;
  content: string;
  tag: string | null;
  /** Soru–cevap modunda soru yüzü ipucu (API’den) */
  hint?: string | null;
};

export type McqPayload = {
  options: string[];
  correctIndex: number;
};

export function parseMcqPayload(content: string): McqPayload {
  const j = JSON.parse(content) as unknown;
  if (
    typeof j === "object" &&
    j !== null &&
    "options" in j &&
    "correctIndex" in j &&
    Array.isArray((j as McqPayload).options) &&
    typeof (j as McqPayload).correctIndex === "number"
  ) {
    return j as McqPayload;
  }
  throw new Error("Geçersiz çoktan seçmeli verisi");
}

export async function fetchTopics(): Promise<Topic[]> {
  const r = await fetch(`${base()}/topics`);
  if (!r.ok) throw new Error(`Konular alınamadı (${r.status})`);
  const j = (await r.json()) as { topics: Topic[] };
  return j.topics;
}

export async function fetchSubtopics(topicId: string): Promise<{
  topicId: string;
  title: string;
  subtopics: Subtopic[];
}> {
  const r = await fetch(`${base()}/topics/${encodeURIComponent(topicId)}/subtopics`);
  if (!r.ok) throw new Error(`Alt konular alınamadı (${r.status})`);
  return r.json();
}

export async function fetchSubtopicMeta(subtopicId: string): Promise<{
  subtopicId: string;
  title: string;
  topicId: string;
  topicTitle: string;
}> {
  const r = await fetch(`${base()}/subtopics/${encodeURIComponent(subtopicId)}`);
  if (!r.ok) throw new Error(`Alt konu bilgisi alınamadı (${r.status})`);
  return r.json();
}

export async function fetchCards(
  subtopicId: string,
  kind: CardKind = "INFORMATION",
): Promise<{
  subtopicId: string;
  title: string;
  topicId: string;
  topicTitle: string;
  kind: CardKind;
  cards: StudyCard[];
}> {
  const r = await fetch(
    `${base()}/subtopics/${encodeURIComponent(subtopicId)}/cards?kind=${encodeURIComponent(kind)}`,
  );
  if (!r.ok) throw new Error(`Kartlar alınamadı (${r.status})`);
  return r.json();
}

/** @deprecated Bilgi kartları için `fetchCards(id, "INFORMATION")` kullanın */
export type InformationCard = {
  id: string;
  title: string;
  content: string;
  tag: string | null;
};
