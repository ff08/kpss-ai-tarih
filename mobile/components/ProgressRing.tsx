import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import type { ColorPalette } from "../constants/theme";

type Props = {
  /** 0–100 */
  percent: number;
  size?: number;
  strokeWidth?: number;
  colors: ColorPalette;
};

export function ProgressRing({ percent, size = 56, strokeWidth = 4, colors }: Props) {
  const p = Math.min(100, Math.max(0, percent));
  const r = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - p / 100);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle cx={cx} cy={cy} r={r} stroke={colors.border} strokeWidth={strokeWidth} fill="none" />
        <G rotation="-90" origin={`${cx}, ${cy}`}>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={colors.mcqCorrectBorder}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.pct, { color: colors.text }]}>{p}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "relative", justifyContent: "center", alignItems: "center" },
  svg: { position: "absolute" },
  center: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" },
  pct: { fontSize: 13, fontWeight: "800", fontVariant: ["tabular-nums"] },
});
