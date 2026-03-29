import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser } from "../lib/authApi";
import { fetchMe, logoutSession } from "../lib/authApi";
import { isOnboardingComplete as loadOnboardingDone } from "../lib/onboardingStorage";
const TOKEN_KEY = "@tarihai_session_token_v1";

type AuthContextValue = {
  ready: boolean;
  /** Ana uygulamaya geçmeden önce onboarding tamamlanmalı */
  needsOnboarding: boolean;
  token: string | null;
  user: AuthUser | null;
  premium: boolean;
  setSession: (token: string, user: AuthUser, premium?: boolean) => Promise<void>;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
  setNeedsOnboarding: (v: boolean) => void;
  refreshOnboardingFromStorage: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [premium, setPremium] = useState(false);

  const hydrate = useCallback(async () => {
    const [done, stored] = await Promise.all([loadOnboardingDone(), AsyncStorage.getItem(TOKEN_KEY)]);
    setNeedsOnboarding(!done);
    if (stored) {
      setToken(stored);
      try {
        const me = await fetchMe(stored);
        setUser(me.user);
        setPremium(me.premium);
      } catch {
        await AsyncStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setPremium(false);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const setSession = useCallback(async (t: string, u: AuthUser, p?: boolean) => {
    await AsyncStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setUser(u);
    if (p !== undefined) setPremium(p);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const me = await fetchMe(token);
      setUser(me.user);
      setPremium(me.premium);
    } catch {
      /* ignore */
    }
  }, [token]);

  const signOut = useCallback(async () => {
    const t = token;
    if (t) await logoutSession(t);
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setPremium(false);
    const done = await loadOnboardingDone();
    setNeedsOnboarding(!done);
  }, [token]);

  const refreshOnboardingFromStorage = useCallback(async () => {
    const done = await loadOnboardingDone();
    setNeedsOnboarding(!done);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      needsOnboarding,
      token,
      user,
      premium,
      setSession,
      refreshUser,
      signOut,
      setNeedsOnboarding,
      refreshOnboardingFromStorage,
    }),
    [ready, needsOnboarding, token, user, premium, setSession, refreshUser, signOut, refreshOnboardingFromStorage],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
