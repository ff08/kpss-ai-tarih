import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StudyProgressProvider } from "../contexts/StudyProgressContext";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StudyProgressProvider>
        <RootLayoutInner />
      </StudyProgressProvider>
    </ThemeProvider>
  );
}

function RootLayoutInner() {
  const { colors, mode } = useTheme();

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="topic/[topicId]" />
        <Stack.Screen name="subtopic/[subtopicId]" />
      </Stack>
    </>
  );
}
