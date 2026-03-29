import { getDefaultApiBase } from "./config";
import { contentApiAuthParts } from "./contentApiContext";

const base = () => getDefaultApiBase();

export type Topic = {
  id: number;
  title: string;
  sortOrder: number;
  description?: string | null;
  subtopicCount: number;
  informationCount: number;
  openQaCount: number;
  wordGameCount: number;
  mcqCount: number;
};

export type Subtopic = {
  id: number;
  title: string;
  /** Konu ekranı kartı; API’den gelir, boşsa istemci yedek metin kullanır. */
  description?: string | null;
  sortOrder: number;
  informationCount: number;
  openQaCount: number;
  wordGameCount: number;
  mcqCount: number;
};

export type CardKind = "INFORMATION" | "OPEN_QA" | "MCQ" | "WORD_GAME";

export type ContentDatasetKind = "INFORMATION" | "OPEN_QA" | "MCQ" | "WORD_GAME";

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
  /** INFORMATION kartları için opsiyonel görsel URL */
  imageUrl?: string | null;
  /** Soru–cevap modunda soru yüzü ipucu (API’den) */
  hint?: string | null;
};

export type McqPayload = {
  options: string[];
  correctIndex: number;
};

export type WordGamePayload = {
  answer: string;
  shuffledLetters: string[];
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

export function parseWordGamePayload(content: string): WordGamePayload {
  const j = JSON.parse(content) as unknown;
  if (
    typeof j === "object" &&
    j !== null &&
    "answer" in j &&
    "shuffledLetters" in j &&
    typeof (j as WordGamePayload).answer === "string" &&
    Array.isArray((j as WordGamePayload).shuffledLetters) &&
    (j as WordGamePayload).shuffledLetters.every((x) => typeof x === "string")
  ) {
    return j as WordGamePayload;
  }
  throw new Error("Gecersiz kelime oyunu verisi");
}

export type CatalogExam = {
  id: number;
  slug: string;
  label: string;
  description: string | null;
  sortOrder: number;
  /** Sadece `includeInactive` ile oturumlu istekte */
  isActive?: boolean;
};

export type CatalogRank = {
  level: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
};

export async function fetchCatalogRanks(): Promise<CatalogRank[]> {
  const { headers, examSlug } = await contentApiAuthParts();
  const sp = new URLSearchParams();
  if (examSlug) sp.set("examSlug", examSlug);
  const q = sp.toString();
  const r = await fetch(`${base()}/catalog/ranks${q ? `?${q}` : ""}`, { headers });
  if (!r.ok) throw new Error(`Rütbe listesi alınamadı (${r.status})`);
  const j = (await r.json()) as { ranks: CatalogRank[] };
  return j.ranks;
}

export async function fetchCatalogExams(opts?: { includeInactive?: boolean; token?: string | null }): Promise<
  CatalogExam[]
> {
  const sp = new URLSearchParams();
  if (opts?.includeInactive && opts.token) {
    sp.set("includeInactive", "1");
  }
  const h: Record<string, string> = {};
  if (opts?.token) h.Authorization = `Bearer ${opts.token}`;
  const q = sp.toString();
  const r = await fetch(`${base()}/catalog/exams${q ? `?${q}` : ""}`, { headers: h });
  if (!r.ok) throw new Error(`Sınav listesi alınamadı (${r.status})`);
  const j = (await r.json()) as { exams: CatalogExam[] };
  return j.exams;
}

export async function fetchTopics(): Promise<Topic[]> {
  const { headers, examSlug } = await contentApiAuthParts();
  const q = examSlug ? `?examSlug=${encodeURIComponent(examSlug)}` : "";
  const r = await fetch(`${base()}/topics${q}`, { headers });
  if (!r.ok) throw new Error(`Konular alınamadı (${r.status})`);
  const j = (await r.json()) as { topics: Topic[] };
  return j.topics;
}

export async function fetchSubtopics(topicId: string | number): Promise<{
  topicId: number;
  title: string;
  subtopics: Subtopic[];
}> {
  const { headers, examSlug } = await contentApiAuthParts();
  const q = examSlug ? `?examSlug=${encodeURIComponent(examSlug)}` : "";
  const r = await fetch(`${base()}/topics/${encodeURIComponent(String(topicId))}/subtopics${q}`, { headers });
  if (!r.ok) throw new Error(`Alt konular alınamadı (${r.status})`);
  return r.json();
}

export async function fetchSubtopicMeta(subtopicId: string | number): Promise<{
  subtopicId: number;
  title: string;
  description?: string | null;
  topicId: number;
  topicTitle: string;
  informationCount: number;
  openQaCount: number;
  wordGameCount: number;
  mcqCount: number;
}> {
  const { headers, examSlug } = await contentApiAuthParts();
  const q = examSlug ? `?examSlug=${encodeURIComponent(examSlug)}` : "";
  const r = await fetch(`${base()}/subtopics/${encodeURIComponent(String(subtopicId))}${q}`, { headers });
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
  const { headers, examSlug } = await contentApiAuthParts();
  const sp = new URLSearchParams({ kind });
  if (examSlug) sp.set("examSlug", examSlug);
  const r = await fetch(
    `${base()}/subtopics/${encodeURIComponent(String(subtopicId))}/cards?${sp.toString()}`,
    { headers },
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
