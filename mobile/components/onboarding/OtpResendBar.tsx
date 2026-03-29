import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ONBOARDING_THEME, OTP_RESEND_COOLDOWN_SEC } from "../../constants/onboardingTheme";

type Props = {
  cooldownSec?: number;
  onResend: () => void | Promise<void>;
  sending?: boolean;
};

export function OtpResendBar({ cooldownSec = OTP_RESEND_COOLDOWN_SEC, onResend, sending }: Props) {
  const [left, setLeft] = useState(cooldownSec);

  useEffect(() => {
    const t = setInterval(() => {
      setLeft((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const canResend = left === 0 && !sending;

  const handleResend = async () => {
    if (!canResend) return;
    await onResend();
    setLeft(cooldownSec);
  };

  return (
    <View style={styles.wrap}>
      {left > 0 ? (
        <Text style={styles.timer}>
          Kodu tekrar gönderebilirsiniz: <Text style={styles.timerAccent}>{left}</Text> sn
        </Text>
      ) : (
        <Pressable onPress={() => void handleResend()} disabled={!canResend} style={({ pressed }) => [pressed && { opacity: 0.75 }]}>
          <Text style={[styles.resend, !canResend && styles.resendDisabled]}>Kodu yeniden gönder</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", marginTop: 20 },
  timer: { fontSize: 14, color: ONBOARDING_THEME.muted, textAlign: "center" },
  timerAccent: { fontWeight: "800", color: ONBOARDING_THEME.primary },
  resend: { fontSize: 15, fontWeight: "600", color: ONBOARDING_THEME.muted },
  resendDisabled: { opacity: 0.5 },
});
