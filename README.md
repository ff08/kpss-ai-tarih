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

Şablon için [`api/.env.example`](api/.env.example) dosyasına bakın; gerçek sırları **asla** repoya eklemeyin.

## GitHub’a yükleme

**GitHub CLI (`gh`) ile otomatik** (önerilen — repoyu oluşturur ve `main` dalını push eder):

1. Bir kez oturum açın: `gh auth login` (tarayıcı veya token ile).
2. Proje kökünde:

   ```powershell
   cd kpss-ai-tarih
   .\scripts\push-to-github.ps1
   ```

   Varsayılan repo adı `kpss-ai-tarih` (public). Farklı ad için: `$env:GITHUB_REPO_NAME = "my-repo"; .\scripts\push-to-github.ps1`

**Manuel:** [github.com/new](https://github.com/new) üzerinde boş repo oluşturup:

```bash
git remote add origin https://github.com/KULLANICI/REPO.git
git push -u origin main
```

## Railway deploy

**Docker build context:** Railway çoğu kurulumda **repo kökünü** (`.`) bağlam alır. Bu yüzden [`Dockerfile`](Dockerfile) **repo kökünde** ve `COPY` satırları **`api/...`** ile başlar; `api/Dockerfile` + `COPY tsconfig.json` kullanıldığında bağlam kök ise `tsconfig.json` bulunamaz.

### Önerilen ayarlar

1. **Settings → Build → Root Directory:** **boş** (veya `.` / `/`) — **`api` yazmayın**; aksi halde `COPY api/...` yolları bozulur.
2. **Builder:** **Dockerfile** (Railpack değil).
3. **Dockerfile path:** `Dockerfile` (kökteki dosya — [`railway.json`](railway.json) ile uyumlu).
4. **`RAILWAY_DOCKERFILE_PATH`** gerekirse: `Dockerfile` (kök).

### Railpack / `start.sh` sorunları

**Builder** hâlâ Railpack ise veya build plan hatası varsa yukarıdaki gibi **Dockerfile** seçin ve **Redeploy** edin.

**Ortam:** PostgreSQL eklentisinden `DATABASE_URL`’i API servisine bağlayın (`PORT` Railway tarafından atanır).

**İlk veri:** Konteyner başlarken `prisma migrate deploy` çalışır; **seed** için bir kez Railway shell veya yerelden `npm run db:seed` (aynı `DATABASE_URL` ile) çalıştırın.

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

- **Expo Go uyumu:** Mobil proje **Expo SDK 54** ile hizalıdır (Expo Go “Supported SDK: 54” ile uyumlu). “Project is incompatible…” hatası için **Expo Go’yu güncelleyin** ve projede `npx expo start` ile aynı SDK’yı kullanın.
- **iOS simülatör / web:** API genelde `http://localhost:3000` ile erişilir.
- **Android emülatör:** Uygulama varsayılan olarak `http://10.0.2.2:3000` kullanır (bilgisayardaki API’ye köprü).
- **Fiziksel cihaz:** Bilgisayarın yerel ağ IP’sini kullanın; `mobile/.env` içinde `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000` tanımlayabilirsiniz (Expo bu değişkeni bundle’a alır).

## İçerik ekleme

- Tüm konu/alt konu ağacı ve **bilgi kartları** [`api/prisma/seed.ts`](api/prisma/seed.ts) + [`api/prisma/seed-cards-data.ts`](api/prisma/seed-cards-data.ts) içindedir (her alt konuda 2 kart; toplam **60** bilgi kartı).
- Seed’i yeniden çalıştırmak mevcut kartları silip baştan yükler: `cd api && npm run db:seed` (`DATABASE_URL` gerekli).
- Yeni kart eklemek için `seed-cards-data.ts` içinde `seedInformationCards` dizisine kayıt ekleyin; `id` değerleri benzersiz olmalıdır.

## Lisans

Özel proje.
