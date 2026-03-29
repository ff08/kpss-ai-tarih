import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import type { CardKind } from "../lib/api";
import {
  loadProgressMap,
  mergeModeProgress,
  overallWeightedPercent,
  saveProgressMap,
  type ProgressMap,
  type SubtopicContentCounts,
  type SubtopicProgress,
} from "../lib/studyProgress";

type StudyProgressContextValue = {
  progress: ProgressMap;
  recordScroll: (subtopicId: number, mode: CardKind, furthestIndex: number, total: number) => Promise<void>;
  getOverall: (
    subtopicId: number,
    counts: SubtopicContentCounts,
  ) => { percentDone: number; percentRemaining: number; hasContent: boolean };
  getSubtopic: (subtopicId: number) => SubtopicProgress | undefined;
  reload: () => Promise<void>;
};

const StudyProgressContext = createContext<StudyProgressContextValue | null>(null);

export function StudyProgressProvider({ children }: { children: ReactNode }) {
  const { token, ready } = useAuth();
  const [progress, setProgress] = useState<ProgressMap>({});
  const progressRef = useRef<ProgressMap>({});

  const reload = useCallback(async () => {
    const map = await loadProgressMap();
    progressRef.current = map;
    setProgress(map);
  }, []);

  useEffect(() => {
    if (!ready) return;
    void reload();
  }, [ready, token, reload]);

  const recordScroll = useCallback(
    async (subtopicId: number, mode: CardKind, furthestIndex: number, total: number) => {
      if (total <= 0) return;
      const prev = progressRef.current;
      const merged = mergeModeProgress(prev[subtopicId], mode, furthestIndex, total);
      const nextMap: ProgressMap = { ...prev, [subtopicId]: merged };
      progressRef.current = nextMap;
      await saveProgressMap(nextMap);
      setProgress(nextMap);
    },
    [],
  );

  const getOverall = useCallback(
    (subtopicId: number, counts: SubtopicContentCounts) => {
      return overallWeightedPercent(progress[subtopicId], counts);
    },
    [progress],
  );

  const getSubtopic = useCallback(
    (subtopicId: number) => progress[subtopicId],
    [progress],
  );

  const value = useMemo<StudyProgressContextValue>(
    () => ({
      progress,
      recordScroll,
      getOverall,
      getSubtopic,
      reload,
    }),
    [progress, recordScroll, getOverall, getSubtopic, reload],
  );

  return <StudyProgressContext.Provider value={value}>{children}</StudyProgressContext.Provider>;
}

export function useStudyProgress(): StudyProgressContextValue {
  const ctx = useContext(StudyProgressContext);
  if (!ctx) {
    throw new Error("useStudyProgress must be used within StudyProgressProvider");
  }
  return ctx;
}
