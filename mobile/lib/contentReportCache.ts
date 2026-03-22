import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "kpss_reported_cards_v1";

export function reportKey(subtopicId: number, datasetKind: string, contentRowId: number): string {
  return `${subtopicId}|${datasetKind}|${contentRowId}`;
}

export async function loadReportedKeySet(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

export async function markCardReported(key: string): Promise<void> {
  const set = await loadReportedKeySet();
  set.add(key);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}
