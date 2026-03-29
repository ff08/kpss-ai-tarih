import { StyleSheet } from "react-native";
import { ONBOARDING_THEME } from "../../constants/onboardingTheme";

export const onboardingStyles = StyleSheet.create({
  /** Alt kısımda sabitlemek için üstte flex:1 içerik kullanın */
  primaryBtnSticky: { marginTop: "auto" },
  primaryBtn: {
    marginBottom: 32,
    backgroundColor: ONBOARDING_THEME.primary,
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  primaryBtnPressed: { opacity: 0.92 },
  primaryBtnText: { color: ONBOARDING_THEME.onPrimary, fontSize: 17, fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: ONBOARDING_THEME.inputBg,
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.border,
    minHeight: 56,
    justifyContent: "center",
  },
  secondaryBtnText: { color: ONBOARDING_THEME.text, fontSize: 16, fontWeight: "600" },
  input: {
    backgroundColor: ONBOARDING_THEME.inputBg,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 18,
    fontWeight: "600",
    color: ONBOARDING_THEME.text,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.border,
  },
  inputErr: { borderColor: ONBOARDING_THEME.error },
});
