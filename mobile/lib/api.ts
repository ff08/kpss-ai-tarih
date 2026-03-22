import { getDefaultApiBase } from "./config";

const base = () => getDefaultApiBase();

export type Topic = {
  id: number;
  title: string;
  sortOrder: number;
  description?: string | null;
  subtopicCount: number;
  informationCount: number;
  openQaCount: number;
  mcqCount: number;
};

export type Subtopic = {
  id: number;
  title: string;
  sortOrder: number;
  informationCount: number;
  openQaCount: number;
  mcqCount: number;
};

export type CardKind = "INFORMATION" | "OPEN_QA" | "MCQ";

export type ContentDatasetKind = "INFORMATION" | "OPEN_QA" | "MCQ";

export type ContentIssueCategory = "WRONG_INFO" | "CONFLICTING_INFO" | "MISSING_INFO";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";

export type StudyCard = {
  /** API’den sayı; yerel placeholder kartlarda string olabilir */
  id: number | string;
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

export async function fetchSubtopics(topicId: string | number): Promise<{
  topicId: number;
  title: string;
  subtopics: Subtopic[];
}> {
  const r = await fetch(`${base()}/topics/${encodeURIComponent(String(topicId))}/subtopics`);
  if (!r.ok) throw new Error(`Alt konular alınamadı (${r.status})`);
  return r.json();
}

export async function fetchSubtopicMeta(subtopicId: string | number): Promise<{
  subtopicId: number;
  title: string;
  topicId: number;
  topicTitle: string;
}> {
  const r = await fetch(`${base()}/subtopics/${encodeURIComponent(String(subtopicId))}`);
  if (!r.ok) throw new Error(`Alt konu bilgisi alınamadı (${r.status})`);
  return r.json();
}

export async function submitContentIssueReport(payload: {
  topicId: number;
  subtopicId: number;
  datasetKind: ContentDatasetKind;
  contentRowId: number;
  category: ContentIssueCategory;
  reporterClientId: string;
  note?: string | null;
  topicTitleSnapshot?: string | null;
  subtopicTitleSnapshot?: string | null;
  cardTitleSnapshot?: string | null;
}): Promise<{ id: number; createdAt: string }> {
  const r = await fetch(`${base()}/content-issue-reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    let msg = `Bildirim gönderilemedi (${r.status})`;
    try {
      const j = (await r.json()) as { error?: string };
      if (typeof j.error === "string") msg = j.error;
    } catch {
      /* ignore */
    }
    const err = new Error(msg) as Error & { status?: number };
    err.status = r.status;
    throw err;
  }
  return r.json() as Promise<{ id: number; createdAt: string }>;
}

export async function fetchCards(
  subtopicId: string | number,
  kind: CardKind = "INFORMATION",
): Promise<{
  subtopicId: number;
  title: string;
  topicId: number;
  topicTitle: string;
  kind: CardKind;
  cards: StudyCard[];
}> {
  const r = await fetch(
    `${base()}/subtopics/${encodeURIComponent(String(subtopicId))}/cards?kind=${encodeURIComponent(kind)}`,
  );
  if (!r.ok) throw new Error(`Kartlar alınamadı (${r.status})`);
  return r.json();
}

/** @deprecated Bilgi kartları için `fetchCards(id, "INFORMATION")` kullanın */
export type InformationCard = {
  id: number;
  title: string;
  content: string;
  tag: string | null;
};
