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
};
