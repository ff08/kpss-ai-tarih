import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CardKind } from "./api";

/** Alt konu çalışma yolunda mod sırası (önce bilgi → soru–cevap → çoktan seçmeli → kelime oyunu). */
export const STUDY_PATH_MODE_ORDER: CardKind[] = ["INFORMATION", "OPEN_QA", "MCQ", "WORD_GAME"];

export type StudyPathStep = { kind: CardKind; count: number };

export function isModeComplete(
  p: SubtopicProgress | undefined,
  mode: CardKind,
  totalInDb: number,
): boolean {
  if (totalInDb <= 0) return true;
  const m = p?.[mode];
  if (!m || m.furthestIndex < 0) return false;
  return m.furthestIndex >= totalInDb - 1;
}

/** Sadece kartı olan modları sırayla döndürür. */
export function buildStudyPathSteps(counts: SubtopicContentCounts): StudyPathStep[] {
  const out: StudyPathStep[] = [];
  for (const kind of STUDY_PATH_MODE_ORDER) {
    const n =
      kind === "INFORMATION"
        ? counts.informationCount
        : kind === "OPEN_QA"
          ? counts.openQaCount
          : kind === "MCQ"
            ? counts.mcqCount
            : counts.wordGameCount;
    if (n > 0) out.push({ kind, count: n });
  }
  return out;
}

export type StudyPathStepStatus = "completed" | "active" | "locked";

export function getStudyPathStepStates(
  p: SubtopicProgress | undefined,
  steps: StudyPathStep[],
): Array<StudyPathStep & { status: StudyPathStepStatus }> {
  let activeAssigned = false;
  return steps.map((step, i) => {
    const complete = isModeComplete(p, step.kind, step.count);
    const unlocked = i === 0 || isModeComplete(p, steps[i - 1].kind, steps[i - 1].count);
    let status: StudyPathStepStatus;
    if (!unlocked) {
      status = "locked";
    } else if (complete) {
      status = "completed";
    } else if (!activeAssigned) {
      status = "active";
      activeAssigned = true;
    } else {
      status = "locked";
    }
    return { ...step, status };
  });
}

export function subtopicCountsFromApi(st: {
  informationCount: number;
  openQaCount: number;
  wordGameCount: number;
  mcqCount: number;
}): SubtopicContentCounts {
  return {
    informationCount: st.informationCount ?? 0,
    openQaCount: st.openQaCount ?? 0,
    wordGameCount: st.wordGameCount ?? 0,
    mcqCount: st.mcqCount ?? 0,
  };
}

/** Tüm modlar (içerik varsa) tamamlandı mı? İçerik yoksa tamam sayılır. */
export function isSubtopicFullyComplete(
  p: SubtopicProgress | undefined,
  counts: SubtopicContentCounts,
): boolean {
  const steps = buildStudyPathSteps(counts);
  if (steps.length === 0) return true;
  return steps.every((s) => isModeComplete(p, s.kind, s.count));
}

export type TopicPathStep = {
  subtopicId: number;
  subtopicTitle: string;
  kind: CardKind;
  count: number;
};

/** Tüm alt konuların (kartı olan) modlarını sortOrder ile tek listede birleştirir. */
export function buildFullTopicPath(
  sortedSubtopics: Array<{
    id: number;
    title: string;
    sortOrder: number;
    informationCount: number;
    openQaCount: number;
    wordGameCount: number;
    mcqCount: number;
  }>,
): TopicPathStep[] {
  const sorted = [...sortedSubtopics].sort((a, b) => a.sortOrder - b.sortOrder);
  const out: TopicPathStep[] = [];
  for (const st of sorted) {
    const counts = subtopicCountsFromApi(st);
    const modeSteps = buildStudyPathSteps(counts);
    for (const step of modeSteps) {
      out.push({
        subtopicId: st.id,
        subtopicTitle: st.title,
        kind: step.kind,
        count: step.count,
      });
    }
  }
  return out;
}

export function isSubtopicUnlockedByOrder(
  subtopicId: number,
  sortedSubtopics: Array<{
    id: number;
    sortOrder: number;
    informationCount: number;
    openQaCount: number;
    wordGameCount: number;
    mcqCount: number;
  }>,
  getSubtopic: (id: number) => SubtopicProgress | undefined,
): boolean {
  const sorted = [...sortedSubtopics].sort((a, b) => a.sortOrder - b.sortOrder);
  const idx = sorted.findIndex((s) => s.id === subtopicId);
  if (idx <= 0) return true;
  return sorted.slice(0, idx).every((s) =>
    isSubtopicFullyComplete(getSubtopic(s.id), subtopicCountsFromApi(s)),
  );
}

export function getTopicPathStepStates(
  flat: TopicPathStep[],
  sortedSubtopics: Array<{
    id: number;
    sortOrder: number;
    informationCount: number;
    openQaCount: number;
    wordGameCount: number;
    mcqCount: number;
  }>,
  getSubtopic: (id: number) => SubtopicProgress | undefined,
): Array<TopicPathStep & { status: StudyPathStepStatus }> {
  const sorted = [...sortedSubtopics].sort((a, b) => a.sortOrder - b.sortOrder);
  let activeAssigned = false;
  return flat.map((step, i) => {
    const p = getSubtopic(step.subtopicId);
    const complete = isModeComplete(p, step.kind, step.count);
    const prev = flat[i - 1];
    const prevComplete =
      i === 0 ? true : isModeComplete(getSubtopic(prev.subtopicId), prev.kind, prev.count);
    const subtopicOk = isSubtopicUnlockedByOrder(step.subtopicId, sorted, getSubtopic);
    const unlocked = subtopicOk && prevComplete;
    let status: StudyPathStepStatus;
    if (!unlocked) {
      status = "locked";
    } else if (complete) {
      status = "completed";
    } else if (!activeAssigned) {
      status = "active";
      activeAssigned = true;
    } else {
      status = "locked";
    }
    return { ...step, status };
  });
}

const STORAGE_KEY = "kpss_study_progress_v1";

export type ModeProgress = {
  /** İlerleme yüzdesi için: görülen en ileri kart */
  furthestIndex: number;
  totalLastSeen: number;
  /** Kaldığı yerden devam: son görülen kart (kaydırma anındaki indeks) */
  lastViewedIndex?: number;
};

export type SubtopicProgress = {
  INFORMATION?: ModeProgress;
  OPEN_QA?: ModeProgress;
  MCQ?: ModeProgress;
  WORD_GAME?: ModeProgress;
  updatedAt: number;
};

export type SubtopicContentCounts = {
  informationCount: number;
  openQaCount: number;
  wordGameCount: number;
  mcqCount: number;
};

export type ProgressMap = Record<number, SubtopicProgress>;

/** Alt konu listesi için toplam kart sayısı (topic API alanlarından) */
export function topicTotalCardsFromTopic(t: {
  informationCount: number;
  openQaCount: number;
  wordGameCount: number;
  mcqCount: number;
}): number {
  return t.informationCount + t.openQaCount + t.wordGameCount + t.mcqCount;
}

/**
 * Birden fazla alt konunun tamamlanma yüzdelerini kart sayısına göre ağırlıklı birleştirir.
 */
export function aggregateWeightedPercent(
  subtopics: Array<{
    id: number;
    informationCount: number;
    openQaCount: number;
    wordGameCount: number;
    mcqCount: number;
  }>,
  getOverall: (subtopicId: number, counts: SubtopicContentCounts) => { percentDone: number; hasContent: boolean },
): number {
  let num = 0;
  let den = 0;
  for (const s of subtopics) {
    const counts: SubtopicContentCounts = {
      informationCount: s.informationCount,
      openQaCount: s.openQaCount,
      wordGameCount: s.wordGameCount,
      mcqCount: s.mcqCount,
    };
    const total = counts.informationCount + counts.openQaCount + counts.wordGameCount + counts.mcqCount;
    if (total === 0) continue;
    const { percentDone } = getOverall(s.id, counts);
    num += percentDone * total;
    den += total;
  }
  return den > 0 ? Math.round(num / den) : 0;
}

export async function loadProgressMap(): Promise<ProgressMap> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return {};
    const out: ProgressMap = {};
    for (const [k, v] of Object.entries(parsed)) {
      const id = Number(k);
      if (!Number.isFinite(id)) continue;
      if (typeof v === "object" && v !== null && "updatedAt" in v) {
        out[id] = v as SubtopicProgress;
      }
    }
    return out;
  } catch {
    return {};
  }
}

export async function saveProgressMap(map: ProgressMap): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function mergeModeProgress(
  existing: SubtopicProgress | undefined,
  mode: CardKind,
  currentIndex: number,
  total: number,
): SubtopicProgress {
  const prev = existing?.[mode];
  const rawMax = Math.max(currentIndex, prev?.furthestIndex ?? -1);
  const cappedFurthest = total > 0 ? Math.min(rawMax, total - 1) : -1;
  const lastViewed = total > 0 ? Math.min(Math.max(0, currentIndex), total - 1) : 0;
  return {
    ...existing,
    [mode]: {
      furthestIndex: cappedFurthest,
      lastViewedIndex: lastViewed,
      totalLastSeen: total,
    },
    updatedAt: Date.now(),
  };
}

/** Mod açıldığında listede hangi karta gidileceği (total değişince sıkıştırılır). */
export function getResumeIndexForMode(
  p: SubtopicProgress | undefined,
  mode: CardKind,
  total: number,
): number {
  if (total <= 0) return 0;
  const m = p?.[mode];
  if (!m) return 0;
  const prefer = m.lastViewedIndex ?? m.furthestIndex;
  if (prefer < 0) return 0;
  return Math.min(prefer, total - 1);
}

function modeRatioForMode(
  p: SubtopicProgress | undefined,
  mode: CardKind,
  totalInDb: number,
): number {
  if (totalInDb <= 0) return 0;
  const m = p?.[mode];
  if (!m || m.furthestIndex < 0) return 0;
  const f = Math.min(m.furthestIndex, totalInDb - 1);
  return Math.min(1, (f + 1) / totalInDb);
}

/** Ağırlıklı tamamlanma: (p_i*n_i + p_q*n_q + p_w*n_w + p_m*n_m) / toplam */
/**
 * Üniteler sırayla: bir ünitedeki tüm alt konular tamamlanmadan sonraki sayılmaz.
 * Alt konu yoksa o ünite tamamlanmış sayılmaz.
 */
export function countConsecutiveCompletedUnits(
  sortedTopics: Array<{ id: number; sortOrder: number }>,
  subtopicsByTopicId: Record<
    number,
    Array<{
      id: number;
      sortOrder: number;
      informationCount: number;
      openQaCount: number;
      wordGameCount: number;
      mcqCount: number;
    }>
  >,
  getSubtopic: (id: number) => SubtopicProgress | undefined,
): number {
  const topics = [...sortedTopics].sort((a, b) => a.sortOrder - b.sortOrder);
  let count = 0;
  for (const topic of topics) {
    const subs = [...(subtopicsByTopicId[topic.id] ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
    if (subs.length === 0) break;
    const allComplete = subs.every((s) =>
      isSubtopicFullyComplete(getSubtopic(s.id), subtopicCountsFromApi(s)),
    );
    if (!allComplete) break;
    count++;
  }
  return count;
}

export function overallWeightedPercent(
  p: SubtopicProgress | undefined,
  counts: SubtopicContentCounts,
): { percentDone: number; percentRemaining: number; hasContent: boolean } {
  const nI = counts.informationCount;
  const nQ = counts.openQaCount;
  const nW = counts.wordGameCount;
  const nM = counts.mcqCount;
  const sum = nI + nQ + nW + nM;
  if (sum === 0) {
    return { percentDone: 0, percentRemaining: 100, hasContent: false };
  }
  const overall =
    (modeRatioForMode(p, "INFORMATION", nI) * nI +
      modeRatioForMode(p, "OPEN_QA", nQ) * nQ +
      modeRatioForMode(p, "WORD_GAME", nW) * nW +
      modeRatioForMode(p, "MCQ", nM) * nM) /
    sum;
  const percentDone = Math.min(100, Math.max(0, Math.round(overall * 100)));
  return {
    percentDone,
    percentRemaining: 100 - percentDone,
    hasContent: true,
  };
}
