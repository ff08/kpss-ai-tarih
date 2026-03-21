import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  color: string;
  size?: number;
};

/** Rastgele sekmesi: sürekli hafif sallanan / ölçeklenen shuffle ikonu */
export function RandomTabIcon({ color, size = 20 }: Props) {
  const wobble = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wobble, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(wobble, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [wobble]);

  const rotate = wobble.interpolate({
    inputRange: [0, 1],
    outputRange: ["-10deg", "10deg"],
  });
  const scale = wobble.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.08, 1],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }, { scale }] }}>
      <Ionicons name="shuffle" size={size} color={color} />
    </Animated.View>
  );
}
