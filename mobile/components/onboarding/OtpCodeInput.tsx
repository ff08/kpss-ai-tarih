import { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { ONBOARDING_THEME } from "../../constants/onboardingTheme";

type Props = {
  value: string;
  onChangeText: (next: string) => void;
  length?: number;
  /** Tüm haneler dolduğunda bir kez */
  onComplete?: () => void;
};

export function OtpCodeInput({ value, onChangeText, length = 6, onComplete }: Props) {
  const refs = useRef<(TextInput | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState(0);
  const didCompleteRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const digits = value.replace(/\D/g, "").slice(0, length);

  useEffect(() => {
    if (digits.length === length) {
      if (!didCompleteRef.current) {
        didCompleteRef.current = true;
        onCompleteRef.current?.();
      }
    } else {
      didCompleteRef.current = false;
    }
  }, [digits.length, length]);

  const onKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
      setFocusIndex(index - 1);
      onChangeText(digits.slice(0, index - 1) + digits.slice(index));
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length }, (_, i) => {
        const focused = focusIndex === i;
        const char = digits[i] ?? "";
        return (
          <TextInput
            key={i}
            ref={(r) => {
              refs.current[i] = r;
            }}
            value={char}
            onChangeText={(t) => {
              const d = t.replace(/\D/g, "").slice(-1);
              if (d) {
                const next = (digits.slice(0, i) + d + digits.slice(i + 1)).slice(0, length);
                onChangeText(next);
                if (i < length - 1) {
                  refs.current[i + 1]?.focus();
                  setFocusIndex(i + 1);
                }
              } else if (t === "") {
                onChangeText(digits.slice(0, i) + digits.slice(i + 1));
              }
            }}
            onKeyPress={({ nativeEvent }) => onKeyPress(i, nativeEvent.key)}
            onFocus={() => setFocusIndex(i)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            style={[
              styles.cell,
              {
                borderColor: focused ? ONBOARDING_THEME.primary : ONBOARDING_THEME.border,
                backgroundColor: ONBOARDING_THEME.inputBg,
              },
            ]}
            caretHidden
            textAlign="center"
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  cell: {
    width: 48,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 22,
    fontWeight: "700",
    color: ONBOARDING_THEME.text,
  },
});
