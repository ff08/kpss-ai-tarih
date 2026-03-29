import type { RankLevelDef } from "../constants/ranks";

export type MergedRankDef = {
  level: number;
  title: string;
  characteristic: string;
  imageUrl: string | null;
};

export type ApiRankRow = {
  level: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
};

/** API satırları + yerel yedek birleşimi (görsel URL API’den). */
export function mergeRankDefinitions(fallback: RankLevelDef[], api: ApiRankRow[] | null | undefined): MergedRankDef[] {
  const map = new Map<number, MergedRankDef>();
  for (const f of fallback) {
    map.set(f.level, {
      level: f.level,
      title: f.title,
      characteristic: f.characteristic,
      imageUrl: null,
    });
  }
  if (api && api.length > 0) {
    for (const a of api) {
      const prev = map.get(a.level);
      const url = a.imageUrl?.trim();
      map.set(a.level, {
        level: a.level,
        title: a.title?.trim() || prev?.title || `Seviye ${a.level}`,
        characteristic: (a.description ?? prev?.characteristic) || "",
        imageUrl: url || prev?.imageUrl || null,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.level - b.level);
}
