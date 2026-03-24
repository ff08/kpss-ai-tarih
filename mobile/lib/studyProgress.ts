import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CardKind } from "./api";

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
