/** KPSS Tarih müfredatı: 23 ünite = 23 rütbe (Tarih Mühürü). Diğer sınavlar için API `exam_rank_defs` kullanılır. */

export const KPSS_TARIH_RANK_LEVEL_COUNT = 23;

export type RankLevelDef = {
  /** 1..23 */
  level: number;
  /** Tamamlanması gereken ünite sayısı (bu müfredatta level ile aynı). */
  minUnit: number;
  title: string;
  characteristic: string;
};

/** Yerel yedek; API yoksa veya eksik seviyede kullanılır. */
export const KPSS_TARIH_RANKS: RankLevelDef[] = [
  { level: 1, minUnit: 1, title: "Toy", characteristic: "Siyasete yeni giren, henüz yolun başında olan." },
  { level: 2, minUnit: 2, title: "Şakirt", characteristic: "İlim yolunda ilk adımı atan öğrenci." },
  { level: 3, minUnit: 3, title: "Alp", characteristic: "Cesur, savaşçı ruhlu tarih yolcusu." },
  { level: 4, minUnit: 4, title: "Subaşı", characteristic: "Ordu yönetiminde söz sahibi olmaya başlayan." },
  { level: 5, minUnit: 5, title: "Dizdar", characteristic: "Kaleleri (üniteleri) koruyan muhafız." },
  { level: 6, minUnit: 6, title: "Müderris", characteristic: "Artık bilgisini başkalarına aktarabilecek düzeyde." },
  { level: 7, minUnit: 7, title: "Kadı", characteristic: "Hukuk ve adalet konularında hüküm veren." },
  { level: 8, minUnit: 8, title: "Defterdar", characteristic: "Devletin mali kayıtlarına hakim olan." },
  { level: 9, minUnit: 9, title: "Reisülküttab", characteristic: "Devletin yazışmalarını ve diplomasisini yöneten." },
  { level: 10, minUnit: 10, title: "Nişancı", characteristic: "Padişahın mühür ve imzasından sorumlu otorite." },
  { level: 11, minUnit: 11, title: "Beylerbeyi", characteristic: "Geniş bir coğrafyanın (müfredatın) yöneticisi." },
  { level: 12, minUnit: 12, title: "Kaptan-ı Derya", characteristic: "Denizlere (derin konulara) hükmeden." },
  { level: 13, minUnit: 13, title: "Kazasker", characteristic: "Adalet ve eğitim sisteminin en tepesindeki isim." },
  { level: 14, minUnit: 14, title: "Kubbealtı Veziri", characteristic: "Divan-ı Hümayun'un danışman devlet adamı." },
  { level: 15, minUnit: 15, title: "Lala", characteristic: "Padişahları eğiten en üst düzey hoca." },
  { level: 16, minUnit: 16, title: "Miralay", characteristic: "Cephede ordulara komuta eden albay rütbesi." },
  { level: 17, minUnit: 17, title: "Paşa", characteristic: "Stratejik deha ve askeri otorite." },
  { level: 18, minUnit: 18, title: "Vezir", characteristic: "Devletin en yüksek yönetim kademesi." },
  { level: 19, minUnit: 19, title: "Sadrazam", characteristic: "Padişahın mutlak vekili (Müfredatın %80'i bitti)." },
  { level: 20, minUnit: 20, title: "Mareşal", characteristic: "Milli Mücadele'nin başkomutanı." },
  { level: 21, minUnit: 21, title: "Mühürdar", characteristic: "Devletin en mahrem mühürlerini taşıyan." },
  { level: 22, minUnit: 22, title: "Cihan Hakimi", characteristic: "Tarihin tüm sırlarına vakıf olmuş lider." },
  { level: 23, minUnit: 23, title: "Tarih Yazıcısı", characteristic: "Tarihi sadece öğrenen değil, adeta yeniden yazan." },
];
