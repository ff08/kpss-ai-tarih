-- Sınav / müfredat kataloğu ve konu kapsamı

CREATE TABLE "exam_catalog" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_catalog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "exam_catalog_slug_key" ON "exam_catalog"("slug");

INSERT INTO "exam_catalog" ("slug", "label", "description", "sortOrder", "isActive", "updatedAt") VALUES
('kpss_lisans_tarih', 'KPSS Lisans — Tarih', 'KPSS Genel Yetenek Tarih müfredatı', 10, true, CURRENT_TIMESTAMP),
('kpss_onlisans_tarih', 'KPSS Önlisans — Tarih', NULL, 20, false, CURRENT_TIMESTAMP),
('yks_tarih', 'YKS — Tarih', NULL, 30, false, CURRENT_TIMESTAMP),
('ayt_tarih', 'AYT — Tarih', NULL, 40, false, CURRENT_TIMESTAMP),
('lgs_tarih', 'LGS — Tarih', NULL, 50, false, CURRENT_TIMESTAMP),
('eyds_tarih', 'e-YDS — Tarih', NULL, 60, false, CURRENT_TIMESTAMP),
('diger_tarih', 'Diğer sınavlar (Tarih)', NULL, 100, false, CURRENT_TIMESTAMP);

-- Mevcut konular varsayılan: KPSS Lisans Tarih
ALTER TABLE "Topic" ADD COLUMN "examId" INTEGER;

UPDATE "Topic" SET "examId" = (SELECT "id" FROM "exam_catalog" WHERE "slug" = 'kpss_lisans_tarih' LIMIT 1);

ALTER TABLE "Topic" ALTER COLUMN "examId" SET NOT NULL;

ALTER TABLE "Topic" ADD CONSTRAINT "Topic_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam_catalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "Topic_examId_idx" ON "Topic"("examId");

ALTER TABLE "users" ADD COLUMN "selectedExamId" INTEGER;

ALTER TABLE "users" ADD CONSTRAINT "users_selectedExamId_fkey" FOREIGN KEY ("selectedExamId") REFERENCES "exam_catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "users_selectedExamId_idx" ON "users"("selectedExamId");

UPDATE "users" SET "selectedExamId" = (SELECT "id" FROM "exam_catalog" WHERE "slug" = 'kpss_lisans_tarih' LIMIT 1) WHERE "selectedExamId" IS NULL;

UPDATE "users" SET "selectedExamId" = (SELECT "id" FROM "exam_catalog" WHERE "slug" = 'kpss_onlisans_tarih' LIMIT 1) WHERE "examTargetId" = 'kpss_on_lisans';

UPDATE "users" SET "selectedExamId" = (SELECT "id" FROM "exam_catalog" WHERE "slug" = 'kpss_lisans_tarih' LIMIT 1) WHERE "examTargetId" IN ('kpss_lisans', 'kpss_ortaogretim', 'kpss_dhbt', 'kpss_ogretmenlik', 'diger') OR "examTargetId" IS NULL;
