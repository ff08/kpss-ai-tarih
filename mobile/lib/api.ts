import { getDefaultApiBase } from "./config";

const base = () => getDefaultApiBase();

export type Topic = { id: string; title: string; sortOrder: number };

export type Subtopic = { id: string; title: string; sortOrder: number };

export type InformationCard = {
  id: string;
  title: string;
  content: string;
  tag: string | null;
};

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

export async function fetchCards(subtopicId: string): Promise<{
  subtopicId: string;
  title: string;
  topicId: string;
  topicTitle: string;
  cards: InformationCard[];
}> {
  const r = await fetch(`${base()}/subtopics/${encodeURIComponent(subtopicId)}/cards`);
  if (!r.ok) throw new Error(`Kartlar alınamadı (${r.status})`);
  return r.json();
}
