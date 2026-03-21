export type ThemeMode = "light" | "dark";

export type ColorPalette = {
  bg: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  tagBg: string;
  onAccent: string;
  difficultyEasy: string;
  difficultyEasyBg: string;
  difficultyMedium: string;
  difficultyMediumBg: string;
  difficultyHard: string;
  difficultyHardBg: string;
  mcqCorrectBg: string;
  mcqCorrectBorder: string;
  mcqWrongBg: string;
  mcqWrongBorder: string;
  /** Çoktan seçmeli kart gövdesi — zorluk (çok açık tonlar) */
  mcqSlideBgEasy: string;
  mcqSlideBgMedium: string;
  mcqSlideBgHard: string;
  /** Anasayfa konu satırı istatistik chip’leri */
  topicStatSubBg: string;
  topicStatSubFg: string;
  topicStatInfoBg: string;
  topicStatInfoFg: string;
  topicStatQaBg: string;
  topicStatQaFg: string;
  topicStatMcqBg: string;
  topicStatMcqFg: string;
};

export const darkPalette: ColorPalette = {
  bg: "#0f1419",
  surface: "#161d27",
  card: "#1a2332",
  border: "#2a3544",
  text: "#e8eaed",
  muted: "#9aa5b1",
  accent: "#7c9cff",
  tagBg: "#2d3a52",
  onAccent: "#0f1419",
  difficultyEasy: "#5c9e6e",
  difficultyEasyBg: "#1a2e22",
  difficultyMedium: "#d4a054",
  difficultyMediumBg: "#2e2618",
  difficultyHard: "#e07a7a",
  difficultyHardBg: "#2e1a1a",
  mcqCorrectBg: "#1a2e1f",
  mcqCorrectBorder: "#4caf50",
  mcqWrongBg: "#2e1a1a",
  mcqWrongBorder: "#e57373",
  mcqSlideBgEasy: "#1a2a24",
  mcqSlideBgMedium: "#2a2318",
  mcqSlideBgHard: "#2a1c1c",
  topicStatSubBg: "#3d3520",
  topicStatSubFg: "#f0e6b8",
  topicStatInfoBg: "#1e2a3d",
  topicStatInfoFg: "#a8c4ff",
  topicStatQaBg: "#2d2440",
  topicStatQaFg: "#d4b8f0",
  topicStatMcqBg: "#243d38",
  topicStatMcqFg: "#a8e6d4",
};

/** Aydınlık: beyaz/açık gri arka plan */
export const lightPalette: ColorPalette = {
  bg: "#ffffff",
  surface: "#f4f6f9",
  card: "#ffffff",
  border: "#e1e6ed",
  text: "#1a2332",
  muted: "#5c6673",
  accent: "#3d5cff",
  tagBg: "#e8ecf8",
  onAccent: "#ffffff",
  difficultyEasy: "#2d6a3e",
  difficultyEasyBg: "#e8f5ec",
  difficultyMedium: "#a66b00",
  difficultyMediumBg: "#fff4e0",
  difficultyHard: "#b71c1c",
  difficultyHardBg: "#ffebee",
  mcqCorrectBg: "#e8f5e9",
  mcqCorrectBorder: "#2e7d32",
  mcqWrongBg: "#ffebee",
  mcqWrongBorder: "#c62828",
  mcqSlideBgEasy: "#ecf8f0",
  mcqSlideBgMedium: "#fff5e8",
  mcqSlideBgHard: "#fff0f0",
  topicStatSubBg: "#fff8e6",
  topicStatSubFg: "#7a5f00",
  topicStatInfoBg: "#e8f0ff",
  topicStatInfoFg: "#1e4a8c",
  topicStatQaBg: "#f3e8ff",
  topicStatQaFg: "#5b2d8c",
  topicStatMcqBg: "#e6faf5",
  topicStatMcqFg: "#0d5c4a",
};
