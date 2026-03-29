import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../contexts/AuthContext";
import { StudyProgressProvider } from "../contexts/StudyProgressContext";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudyProgressProvider>
          <RootLayoutInner />
        </StudyProgressProvider>
      </AuthProvider>
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
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="premium" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="topic/[topicId]" />
        <Stack.Screen name="subtopic/[subtopicId]" />
      </Stack>
    </>
  );
}
