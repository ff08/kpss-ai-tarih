import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ColorPalette } from "../constants/theme";
import type { ContentDatasetKind, ContentIssueCategory } from "../lib/api";
import { useTheme } from "../contexts/ThemeContext";

const CATEGORIES: { id: ContentIssueCategory; label: string }[] = [
  { id: "WRONG_INFO", label: "Yanlış bilgi" },
  { id: "CONFLICTING_INFO", label: "Çelişkili bilgi" },
  { id: "MISSING_INFO", label: "Eksik bilgi" },
];

const DATASET_LABELS: Record<ContentDatasetKind, string> = {
  INFORMATION: "Bilgi kartı",
  OPEN_QA: "Soru–cevap",
  MCQ: "Çoktan seçmeli",
  WORD_GAME: "Kelime oyunu",
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (category: ContentIssueCategory, note: string) => Promise<void>;
  datasetKind: ContentDatasetKind;
  cardTitlePreview: string;
};

export function ContentIssueReportModal({
  visible,
  onClose,
  onSubmit,
  datasetKind,
  cardTitlePreview,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<ContentIssueCategory>("WRONG_INFO");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setCategory("WRONG_INFO");
    setNote("");
    setError(null);
    setSending(false);
  }, []);

  useEffect(() => {
    if (visible) reset();
  }, [visible, reset]);

  const handleClose = useCallback(() => {
    if (sending) return;
    reset();
    onClose();
  }, [onClose, reset, sending]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setSending(true);
    try {
      await onSubmit(category, note.trim());
      reset();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gönderilemedi");
    } finally {
      setSending(false);
    }
  }, [category, note, onClose, onSubmit, reset]);

  const preview = cardTitlePreview.length > 120 ? `${cardTitlePreview.slice(0, 117)}…` : cardTitlePreview;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View style={[styles.sheet, { paddingBottom: Math.max(16, insets.bottom + 8) }]}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>İçerik hatası bildir</Text>
            <Text style={styles.metaLine}>
              Veri seti: <Text style={styles.metaStrong}>{DATASET_LABELS[datasetKind]}</Text>
            </Text>
            <Text style={styles.previewLabel}>Kart</Text>
            <Text style={styles.preview}>{preview || "—"}</Text>

            <Text style={styles.sectionLabel}>Sorun türü</Text>
            <View style={styles.catList}>
              {CATEGORIES.map((c) => {
                const selected = category === c.id;
                return (
                  <Pressable
                    key={c.id}
                    style={[styles.catRow, selected && styles.catRowSelected]}
                    onPress={() => setCategory(c.id)}
                  >
                    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                      {selected ? <View style={styles.radioInner} /> : null}
                    </View>
                    <Text style={[styles.catLabel, selected && styles.catLabelSelected]}>{c.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>Not (isteğe bağlı)</Text>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              placeholder="Kısa açıklama yazabilirsiniz…"
              placeholderTextColor={colors.muted}
              multiline
              maxLength={2000}
              editable={!sending}
            />

            {error ? <Text style={styles.err}>{error}</Text> : null}

            <View style={styles.actions}>
              <Pressable style={styles.btnGhost} onPress={handleClose} disabled={sending}>
                <Text style={styles.btnGhostText}>Vazgeç</Text>
              </Pressable>
              <Pressable
                style={[styles.btnPrimary, sending && styles.btnDisabled]}
                onPress={() => void handleSubmit()}
                disabled={sending}
              >
                {sending ? (
                  <ActivityIndicator color={colors.onAccent} />
                ) : (
                  <Text style={styles.btnPrimaryText}>Gönder</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    sheet: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingHorizontal: 20,
      paddingTop: 18,
      maxHeight: "88%",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 8,
    },
    metaLine: {
      color: colors.muted,
      fontSize: 14,
      marginBottom: 10,
    },
    metaStrong: {
      color: colors.text,
      fontWeight: "600",
    },
    previewLabel: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 4,
    },
    preview: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 14,
    },
    sectionLabel: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 8,
    },
    catList: { gap: 8, marginBottom: 14 },
    catRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    catRowSelected: {
      borderColor: colors.accent,
      backgroundColor: colors.tagBg,
    },
    radioOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    radioOuterSelected: { borderColor: colors.accent },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.accent,
    },
    catLabel: { color: colors.text, fontSize: 15, flex: 1 },
    catLabelSelected: { fontWeight: "600" },
    input: {
      minHeight: 72,
      maxHeight: 120,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 12,
      color: colors.text,
      fontSize: 15,
      textAlignVertical: "top",
      marginBottom: 12,
      backgroundColor: colors.bg,
    },
    err: { color: "#e57373", fontSize: 13, marginBottom: 8 },
    actions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
      marginTop: 4,
    },
    btnGhost: { paddingVertical: 12, paddingHorizontal: 16 },
    btnGhostText: { color: colors.accent, fontSize: 16, fontWeight: "600" },
    btnPrimary: {
      backgroundColor: colors.accent,
      paddingVertical: 12,
      paddingHorizontal: 22,
      borderRadius: 10,
      minWidth: 100,
      alignItems: "center",
    },
    btnDisabled: { opacity: 0.7 },
    btnPrimaryText: { color: colors.onAccent, fontSize: 16, fontWeight: "700" },
  });
}
