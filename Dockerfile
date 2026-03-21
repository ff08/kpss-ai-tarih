# API (api/) — monorepo kökünden build; Railpack yerine Dockerfile kullanılır
FROM node:20-slim AS build
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY api/package*.json ./
RUN npm ci

COPY api/prisma ./prisma
COPY api/src ./src
COPY api/tsconfig.json ./

RUN npx prisma generate && npm run build

RUN npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE 3000

# DATABASE_URL ile migrate deploy çalıştır, sonra API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
