-- Rütbe (Tarih Mühürü) tanımları — sınav başına seviye + isteğe bağlı görsel URL

CREATE TABLE "exam_rank_defs" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_rank_defs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "exam_rank_defs_examId_level_key" ON "exam_rank_defs"("examId", "level");

CREATE INDEX "exam_rank_defs_examId_idx" ON "exam_rank_defs"("examId");

ALTER TABLE "exam_rank_defs" ADD CONSTRAINT "exam_rank_defs_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- KPSS Lisans Tarih — 23 ünite / 23 rütbe (imageUrl sonra güncellenir)
INSERT INTO "exam_rank_defs" ("examId", "level", "title", "description", "imageUrl", "updatedAt")
SELECT id, v.level, v.title, v.description, NULL, CURRENT_TIMESTAMP
FROM "exam_catalog" e
CROSS JOIN (VALUES
  (1, 'Toy', 'Siyasete yeni giren, henüz yolun başında olan.'),
  (2, 'Şakirt', 'İlim yolunda ilk adımı atan öğrenci.'),
  (3, 'Alp', 'Cesur, savaşçı ruhlu tarih yolcusu.'),
  (4, 'Subaşı', 'Ordu yönetiminde söz sahibi olmaya başlayan.'),
  (5, 'Dizdar', 'Kaleleri (üniteleri) koruyan muhafız.'),
  (6, 'Müderris', 'Artık bilgisini başkalarına aktarabilecek düzeyde.'),
  (7, 'Kadı', 'Hukuk ve adalet konularında hüküm veren.'),
  (8, 'Defterdar', 'Devletin mali kayıtlarına hakim olan.'),
  (9, 'Reisülküttab', 'Devletin yazışmalarını ve diplomasisini yöneten.'),
  (10, 'Nişancı', 'Padişahın mühür ve imzasından sorumlu otorite.'),
  (11, 'Beylerbeyi', 'Geniş bir coğrafyanın (müfredatın) yöneticisi.'),
  (12, 'Kaptan-ı Derya', 'Denizlere (derin konulara) hükmeden.'),
  (13, 'Kazasker', 'Adalet ve eğitim sisteminin en tepesindeki isim.'),
  (14, 'Kubbealtı Veziri', 'Divan-ı Hümayun''un danışman devlet adamı.'),
  (15, 'Lala', 'Padişahları eğiten en üst düzey hoca.'),
  (16, 'Miralay', 'Cephede ordulara komuta eden albay rütbesi.'),
  (17, 'Paşa', 'Stratejik deha ve askeri otorite.'),
  (18, 'Vezir', 'Devletin en yüksek yönetim kademesi.'),
  (19, 'Sadrazam', 'Padişahın mutlak vekili (Müfredatın %80''i bitti).'),
  (20, 'Mareşal', 'Milli Mücadele''nin başkomutanı.'),
  (21, 'Mühürdar', 'Devletin en mahrem mühürlerini taşıyan.'),
  (22, 'Cihan Hakimi', 'Tarihin tüm sırlarına vakıf olmuş lider.'),
  (23, 'Tarih Yazıcısı', 'Tarihi sadece öğrenen değil, adeta yeniden yazan.')
) AS v(level, title, description)
WHERE e.slug = 'kpss_lisans_tarih';
