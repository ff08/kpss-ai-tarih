# KPSS AI Tarih

KPSS Tarih için **bilgi kartları** (Faz 1): Expo (React Native) mobil uygulama + **Fastify** + **PostgreSQL** (Prisma) API. Backend ve veritabanı **Railway** üzerinde çalışmaya uygundur.

## Proje yapısı

- `api/` — REST API (`GET /topics`, `GET /topics/:topicId/subtopics`, `GET /subtopics/:subtopicId/cards`, `GET /health`)
- `mobile/` — Expo Router ile konu → alt konu → yatay kaydırmalı bilgi kartları
- `docker-compose.yml` — Yerel PostgreSQL (Docker yüklüyse)

## Gereksinimler

- Node.js 20+
- PostgreSQL (yerel Docker, Railway veya başka bir sunucu)

## Veritabanını hazırlama

1. `api/.env` içinde `DATABASE_URL` değerini ayarlayın. Örnek (yerel Docker):

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kpss_ai_tarih?schema=public"
   ```

2. Şemayı uygulayıp örnek içeriği yükleyin:

   ```bash
   cd api
   npm install
   npx prisma migrate deploy
   npm run db:seed
   ```

**Railway:** Projeye PostgreSQL ekleyin, `DATABASE_URL` ortam değişkenini Railway’ın verdiği bağlantı ile değiştirin. Deploy öncesi veya release aşamasında `npx prisma migrate deploy` çalıştırın; seed’i yalnızca ilk kurulumda veya güvenli bir admin akışıyla çalıştırın.

## API’yi çalıştırma

```bash
cd api
npm run dev
```

Varsayılan adres: `http://localhost:3000` (Railway’da `PORT` otomatik atanır).

## Mobil uygulama

```bash
cd mobile
npm install
npx expo start
```

- **iOS simülatör / web:** API genelde `http://localhost:3000` ile erişilir.
- **Android emülatör:** Uygulama varsayılan olarak `http://10.0.2.2:3000` kullanır (bilgisayardaki API’ye köprü).
- **Fiziksel cihaz:** Bilgisayarın yerel ağ IP’sini kullanın; `mobile/.env` içinde `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000` tanımlayabilirsiniz (Expo bu değişkeni bundle’a alır).

## İçerik ekleme

- Örnek bilgi kartları `api/prisma/seed.ts` içinde; `turk_name_culture_centers` alt konusunda 3 kart vardır.
- Yeni kartlar için `InformationCard` satırları ekleyip seed’i tekrar çalıştırın veya SQL/Prisma ile doğrudan ekleyin.

## Lisans

Özel proje.
