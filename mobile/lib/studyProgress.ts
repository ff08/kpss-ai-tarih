import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CardKind } from "./api";

const STORAGE_KEY = "kpss_study_progress_v1";

export type ModeProgress = {
  furthestIndex: number;
  totalLastSeen: number;
};

export type SubtopicProgress = {
  INFORMATION?: ModeProgress;
  OPEN_QA?: ModeProgress;
  MCQ?: ModeProgress;
  updatedAt: number;
};

export type SubtopicContentCounts = {
  informationCount: number;
  openQaCount: number;
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
  furthestIndex: number,
  total: number,
): SubtopicProgress {
  const prev = existing?.[mode];
  const rawMax = Math.max(furthestIndex, prev?.furthestIndex ?? -1);
  const capped = total > 0 ? Math.min(rawMax, total - 1) : -1;
  return {
    ...existing,
    [mode]: { furthestIndex: capped, totalLastSeen: total },
    updatedAt: Date.now(),
  };
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

/** Ağırlıklı tamamlanma: (p_i*n_i + p_q*n_q + p_m*n_m) / (n_i+n_q+n_m) */
export function overallWeightedPercent(
  p: SubtopicProgress | undefined,
  counts: SubtopicContentCounts,
): { percentDone: number; percentRemaining: number; hasContent: boolean } {
  const nI = counts.informationCount;
  const nQ = counts.openQaCount;
  const nM = counts.mcqCount;
  const sum = nI + nQ + nM;
  if (sum === 0) {
    return { percentDone: 0, percentRemaining: 100, hasContent: false };
  }
  const overall =
    (modeRatioForMode(p, "INFORMATION", nI) * nI +
      modeRatioForMode(p, "OPEN_QA", nQ) * nQ +
      modeRatioForMode(p, "MCQ", nM) * nM) /
    sum;
  const percentDone = Math.min(100, Math.max(0, Math.round(overall * 100)));
  return {
    percentDone,
    percentRemaining: 100 - percentDone,
    hasContent: true,
  };
}
