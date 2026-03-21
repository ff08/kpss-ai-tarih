import { Platform } from "react-native";

/** Yerel API; Android emülatörde localhost yerine 10.0.2.2 kullanılır. */
export function getDefaultApiBase(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }
  return "http://localhost:3000";
}
