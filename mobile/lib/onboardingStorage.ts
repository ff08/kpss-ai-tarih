import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_PROFILE = "@tarihai_onboarding_profile_v1";
const KEY_DONE = "@tarihai_onboarding_done_v1";

export type OnboardingProfile = {
  displayName: string;
  examTargetId: string;
};

export async function loadOnboardingProfile(): Promise<OnboardingProfile | null> {
  const raw = await AsyncStorage.getItem(KEY_PROFILE);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as OnboardingProfile;
    if (typeof p.displayName === "string" && typeof p.examTargetId === "string") return p;
  } catch {
    /* ignore */
  }
  return null;
}

export async function saveOnboardingProfile(p: OnboardingProfile): Promise<void> {
  await AsyncStorage.setItem(KEY_PROFILE, JSON.stringify(p));
}

export async function isOnboardingComplete(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEY_DONE)) === "1";
}

export async function setOnboardingComplete(done: boolean): Promise<void> {
  if (done) await AsyncStorage.setItem(KEY_DONE, "1");
  else await AsyncStorage.removeItem(KEY_DONE);
}
