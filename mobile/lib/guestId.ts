/** Kalıcı misafir cihaz kimliği (UUID benzeri). */
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@tarihai_guest_client_id_v1";

function randomUuidLike(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getOrCreateGuestClientId(): Promise<string> {
  const existing = await AsyncStorage.getItem(KEY);
  if (existing && existing.length >= 16) return existing;
  const id = randomUuidLike();
  await AsyncStorage.setItem(KEY, id);
  return id;
}
