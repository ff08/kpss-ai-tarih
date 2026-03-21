# Build context: repo kökü (.) — Railway bu şekilde çözer
# COPY yolları api/ ile başlar
FROM node:20-slim
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

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
