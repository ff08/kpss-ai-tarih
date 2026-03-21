import type { ReactNode } from "react";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import type { ColorPalette } from "../constants/theme";
import { useTheme } from "../contexts/ThemeContext";

/** Yalnızca güvenli alan (insets.top); ekstra üst boşluk yok — başlık bandı ekranın üstüne kadar */
const EXTRA_TOP = 0;
/** Header içi alt boşluk */
const EXTRA_BOTTOM = 20;
/** Header bandı ile altındaki ana içerik arası */
const BELOW_HEADER_GAP = 20;

type Props = {
  title: string;
  aboveTitle?: string;
  /** Sayfa başlığının hemen altı: uygulama tagline / kısa açıklama */
  tagline?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode | null;
};

function ThemeToggleButton() {
  const { colors, mode, toggleMode } = useTheme();
  const s = useMemo(() => themed(colors), [colors]);
  return (
    <Pressable
      onPress={toggleMode}
      accessibilityRole="button"
      accessibilityLabel={mode === "dark" ? "Aydınlık moda geç" : "Karanlık moda geç"}
      style={s.themeBtn}
    >
      <Text style={s.themeEmoji}>{mode === "dark" ? "☀️" : "🌙"}</Text>
    </Pressable>
  );
}

export function ScreenHeader({
  title,
  aboveTitle,
  tagline,
  subtitle,
  showBack,
  onBack,
  leftSlot,
  rightSlot,
}: Props) {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => themed(colors), [colors]);

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  const hasLeft = leftSlot != null || showBack;
  const leftControl =
    leftSlot != null ? (
      <View style={s.leftSlotWrap}>{leftSlot}</View>
    ) : showBack ? (
      <Pressable onPress={handleBack} style={s.backBtn} accessibilityRole="button" accessibilityLabel="Geri">
        <Text style={s.backText}>‹ Geri</Text>
      </Pressable>
    ) : null;

  const rightContent =
    rightSlot === null ? null : rightSlot !== undefined ? rightSlot : <ThemeToggleButton />;

  const paddingTop = insets.top + EXTRA_TOP;

  return (
    <View style={[s.outer, { paddingTop, paddingBottom: EXTRA_BOTTOM, marginBottom: BELOW_HEADER_GAP }]}>
      <View style={s.row}>
        <View style={s.textColumn}>
          {hasLeft ? leftControl : null}
          {aboveTitle ? (
            <Text style={s.above} numberOfLines={2}>
              {aboveTitle}
            </Text>
          ) : null}
          <Text style={[s.title, aboveTitle ? s.titleAfterAbove : null]} numberOfLines={3}>
            {title}
          </Text>
          {tagline ? (
            <Text style={s.tagline} numberOfLines={3}>
              {tagline}
            </Text>
          ) : null}
          {subtitle ? (
            <Text style={s.subtitle} numberOfLines={5}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {rightContent != null ? <View style={s.rightWrap}>{rightContent}</View> : null}
      </View>
    </View>
  );
}

function themed(colors: ColorPalette) {
  return StyleSheet.create({
    outer: {
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    textColumn: {
      flex: 1,
      minWidth: 0,
      paddingRight: 12,
    },
    leftSlotWrap: {
      alignSelf: "flex-start",
      marginBottom: 10,
    },
    backBtn: {
      alignSelf: "flex-start",
      paddingVertical: 4,
      paddingRight: 12,
      marginBottom: 10,
    },
    backText: { color: colors.accent, fontSize: 16, fontWeight: "600" },
    above: {
      color: colors.muted,
      fontSize: 13,
      fontWeight: "500",
      marginBottom: 6,
    },
    title: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
      lineHeight: 26,
    },
    titleAfterAbove: {
      marginTop: 4,
    },
    tagline: {
      color: colors.muted,
      fontSize: 12,
      marginTop: 6,
      lineHeight: 17,
    },
    subtitle: {
      color: colors.muted,
      fontSize: 13,
      marginTop: 6,
      lineHeight: 18,
    },
    rightWrap: {
      alignItems: "flex-end",
      justifyContent: "flex-start",
      paddingTop: 2,
      marginLeft: 4,
    },
    themeBtn: { paddingHorizontal: 8, paddingVertical: 6 },
    themeEmoji: { fontSize: 22 },
  });
}
