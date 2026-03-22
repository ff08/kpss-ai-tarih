import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "kpss_reporter_client_id_v1";

function generateUuid(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    const v = ch === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Uygulama ömrü boyunca sabit istemci kimliği (aynı kullanıcı sayılır). */
export async function getReporterClientId(): Promise<string> {
  let id = await AsyncStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = generateUuid();
    await AsyncStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
