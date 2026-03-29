import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

type Props = {
  size?: number;
  accentColor: string;
};

/** Tarih Mühürü — stilize baykuş damgası (hafif nefes animasyonu). */
export function OwlSealSvg({ size = 140, accentColor }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View style={[styles.wrap, { width: size, height: size, transform: [{ scale: pulse }] }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="52" r="38" fill={accentColor} opacity={0.18} />
        <Ellipse cx="50" cy="56" rx="28" ry="32" fill={accentColor} opacity={0.92} />
        <Circle cx="38" cy="48" r="10" fill="#f8faf6" />
        <Circle cx="62" cy="48" r="10" fill="#f8faf6" />
        <Circle cx="38" cy="48" r="5" fill="#1a1a1a" />
        <Circle cx="62" cy="48" r="5" fill="#1a1a1a" />
        <Path d="M46 58 Q50 64 54 58" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <Path d="M50 28 L44 18 L50 22 L56 18 Z" fill={accentColor} />
        <Path d="M28 52 Q20 40 24 32" stroke={accentColor} strokeWidth="3" fill="none" strokeLinecap="round" />
        <Path d="M72 52 Q80 40 76 32" stroke={accentColor} strokeWidth="3" fill="none" strokeLinecap="round" />
        <Ellipse cx="50" cy="72" rx="14" ry="8" fill={accentColor} opacity={0.35} />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
});
