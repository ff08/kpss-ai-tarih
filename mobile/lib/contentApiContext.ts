import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_EXAM_SLUG, legacyExamTargetIdToSlug } from "../constants/examCatalog";
import { loadOnboardingProfile } from "./onboardingStorage";

const TOKEN_KEY = "@tarihai_session_token_v1";

/**
 * Konu / kart istekleri: oturum varsa Bearer (`examSlug` gerekmez);
 * oturum yoksa `examSlug` sorgu parametresi (onboarding profili veya varsayılan).
 */
export async function contentApiAuthParts(): Promise<{
  headers: Record<string, string>;
  /** Oturum yokken zorunlu; oturum varken null */
  examSlug: string | null;
}> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    return { headers: { Authorization: `Bearer ${token}` }, examSlug: null };
  }
  const profile = await loadOnboardingProfile();
  const slug = profile?.examSlug ?? legacyExamTargetIdToSlug(profile?.examTargetId ?? null);
  return { headers: {}, examSlug: slug || DEFAULT_EXAM_SLUG };
}
