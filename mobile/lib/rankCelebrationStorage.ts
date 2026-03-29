import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@tarihai_last_celebrated_completed_units_v1";

let chain: Promise<unknown> = Promise.resolve();

/**
 * Tamamlanan ünite sayısı yeni bir rütbeye ulaştıysa o seviyeyi döndürür (modal için).
 * İlk çalıştırmada mevcut değeri kaydeder, kutlama göstermez.
 * Ardışık çağrılar sıraya alınır.
 */
export function consumeRankCelebrationIfNeeded(completedUnitCount: number): Promise<number | null> {
  const p = chain.then(async (): Promise<number | null> => {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw === null) {
      await AsyncStorage.setItem(KEY, String(completedUnitCount));
      return null;
    }
    const last = parseInt(raw, 10) || 0;
    if (completedUnitCount > last && completedUnitCount > 0) {
      await AsyncStorage.setItem(KEY, String(completedUnitCount));
      return completedUnitCount;
    }
    return null;
  });
  chain = p.then(() => {}).catch(() => {});
  return p;
}
