import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@kpss_exam_active_prefs";

/** id -> kullanıcı pasif yaptıysa false; anahtar yoksa aktif kabul edilir */
export type ExamActivePrefs = Record<string, boolean>;

export async function loadExamActivePrefs(): Promise<ExamActivePrefs> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const j = JSON.parse(raw) as unknown;
    if (typeof j !== "object" || j === null) return {};
    return j as ExamActivePrefs;
  } catch {
    return {};
  }
}

export async function saveExamActivePrefs(prefs: ExamActivePrefs): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function isExamActive(id: string, prefs: ExamActivePrefs): boolean {
  return prefs[id] !== false;
}
