import { useCallback, useRef, useState } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { onboardingStyles } from "../../components/onboarding/onboardingStyles";
import { ONBOARDING_THEME } from "../../constants/onboardingTheme";
import { setIntroWizardComplete } from "../../lib/onboardingStorage";

/** Sıra: 1=ana ekran, 2=çalışma yolu, 3=sınavlar (kullanıcı görselleri) */
const INTRO_IMAGES = [
  require("../../assets/onboarding/intro-1.jpg"),
  require("../../assets/onboarding/intro-2.jpg"),
  require("../../assets/onboarding/intro-3.jpg"),
] as const;

type Slide = {
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    title: "Tarih AI'ya hoş geldiniz",
    body: "KPSS Tarih müfredatını konu konu takip edin; bilgi kartları ve çalışma yolu ile düzenli tekrar yapın.",
  },
  {
    title: "Çalışma yolunda ilerleyin",
    body: "Bilgi kartları, soru–cevap ve çoktan seçmeli adımlarını tamamladıkça ilerlemeniz kaydedilir.",
  },
  {
    title: "Sınavınıza hazırlanın",
    body: "Sınav takvimini görün, geri sayımı takip edin ve genel ilerlemenizi tek ekranda izleyin.",
  },
];

function WaveDivider({ width: w }: { width: number }) {
  const h = 44;
  const mid = w / 2;
  const d = `M0 ${h} L0 22 Q ${mid} 0 ${w} 22 L${w} ${h} Z`;
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={styles.waveSvg}>
      <Path d={d} fill={ONBOARDING_THEME.bg} />
    </Svg>
  );
}

function IntroSlideImage({ slideIndex }: { slideIndex: number }) {
  const source = INTRO_IMAGES[slideIndex];
  return (
    <View style={styles.phoneOuter}>
      <View style={styles.phoneInner}>
        <Image source={source} style={styles.slideImage} contentFit="contain" transition={200} />
      </View>
    </View>
  );
}

export default function OnboardingIntro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenW, height: screenH } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const last = SLIDES.length - 1;

  const finish = useCallback(async () => {
    await setIntroWizardComplete(true);
    router.replace("/onboarding/name");
  }, [router]);

  const goNext = useCallback(() => {
    if (index < last) {
      scrollRef.current?.scrollTo({ x: (index + 1) * screenW, animated: true });
    } else {
      void finish();
    }
  }, [index, last, screenW, finish]);

  const onMomentumEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setIndex(Math.round(x / screenW));
  }, [screenW]);

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <StatusBar style="light" />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
      >
        {SLIDES.map((slide, i) => (
          <View key={slide.title} style={[styles.page, { width: screenW, height: screenH }]}>
            <View style={[styles.greenBlock, { paddingTop: 12 + insets.top }]}>
              <IntroSlideImage slideIndex={i} />
            </View>
            <WaveDivider width={screenW} />
            <View style={[styles.whiteBlock, { paddingBottom: 24 + insets.bottom }]}>
              <View style={styles.textBlock}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.body}>{slide.body}</Text>
              </View>
              <View style={styles.dots}>
                {SLIDES.map((_, di) => (
                  <View key={di} style={[styles.dot, di === i && styles.dotActive]} />
                ))}
              </View>
              {i < last ? (
                <View style={styles.btnRow}>
                  <Pressable
                    style={({ pressed }) => [styles.skipBtn, pressed && { opacity: 0.85 }]}
                    onPress={() => void finish()}
                  >
                    <Text style={styles.skipText}>Atla</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [onboardingStyles.primaryBtn, { marginBottom: 0, flex: 1 }, pressed && onboardingStyles.primaryBtnPressed]}
                    onPress={goNext}
                  >
                    <Text style={onboardingStyles.primaryBtnText}>Devam et</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [onboardingStyles.primaryBtn, { marginBottom: 0 }, pressed && onboardingStyles.primaryBtnPressed]}
                  onPress={() => void finish()}
                >
                  <Text style={onboardingStyles.primaryBtnText}>Başlayalım</Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: ONBOARDING_THEME.primary },
  scroll: { flex: 1 },
  page: {},
  greenBlock: {
    flex: 1.15,
    backgroundColor: ONBOARDING_THEME.primary,
    paddingTop: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  waveSvg: { marginTop: -1 },
  whiteBlock: {
    flex: 1,
    backgroundColor: ONBOARDING_THEME.bg,
    paddingHorizontal: 24,
    paddingTop: 8,
    justifyContent: "space-between",
  },
  textBlock: { flex: 1, justifyContent: "flex-start", paddingTop: 4 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: ONBOARDING_THEME.text,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    color: ONBOARDING_THEME.muted,
    textAlign: "center",
  },
  dots: { flexDirection: "row", justifyContent: "center", gap: 8, marginVertical: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: ONBOARDING_THEME.trackBg },
  dotActive: { width: 24, backgroundColor: ONBOARDING_THEME.primary },
  btnRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  skipBtn: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 28,
    backgroundColor: ONBOARDING_THEME.inputBg,
    minWidth: 100,
    alignItems: "center",
  },
  skipText: { fontSize: 16, fontWeight: "600", color: ONBOARDING_THEME.text },
  phoneOuter: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 300,
    flex: 1,
    maxHeight: 400,
  },
  phoneInner: {
    flex: 1,
    backgroundColor: ONBOARDING_THEME.onPrimary,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  slideImage: {
    width: "100%",
    height: "100%",
  },
});
