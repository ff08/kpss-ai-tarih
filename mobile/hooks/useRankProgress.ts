import { useMemo } from "react";
import type { Subtopic, Topic } from "../lib/api";
import { countConsecutiveCompletedUnits } from "../lib/studyProgress";
import { useStudyProgress } from "../contexts/StudyProgressContext";
import type { MergedRankDef } from "../lib/rankDefinitions";

export type RankProgressState = {
  /** Ardışık tamamlanan ünite sayısı (0..maxLevel). */
  completedUnitCount: number;
  maxLevel: number;
  /** Tamamlanan ünite > 0 ise o seviyenin tanımı. */
  currentRank: MergedRankDef | null;
  /** Sonraki rütbe (varsa). */
  nextRank: MergedRankDef | null;
  /** 0..1 — tamamlanan ünite / max (düz dolgu çubuğu). */
  overallProgress: number;
};

export function useRankProgress(
  sortedTopics: Topic[],
  subtopicsByTopicId: Record<number, Subtopic[]>,
  rankDefs: MergedRankDef[],
): RankProgressState {
  const { getSubtopic } = useStudyProgress();

  const completedUnitCount = useMemo(
    () => countConsecutiveCompletedUnits(sortedTopics, subtopicsByTopicId, getSubtopic),
    [sortedTopics, subtopicsByTopicId, getSubtopic],
  );

  return useMemo(() => {
    const maxLevel = rankDefs.length > 0 ? rankDefs.length : 23;
    const capped = Math.min(completedUnitCount, maxLevel);
    const currentRank = capped > 0 ? rankDefs[capped - 1] ?? null : null;
    const nextRank = capped < maxLevel ? rankDefs[capped] ?? null : null;
    const overallProgress = maxLevel > 0 ? Math.min(1, completedUnitCount / maxLevel) : 0;

    return {
      completedUnitCount,
      maxLevel,
      currentRank,
      nextRank,
      overallProgress,
    };
  }, [completedUnitCount, rankDefs]);
}
