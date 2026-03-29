/**
 * Tüm kullanıcı / oturum / OTP / log kayıtlarını siler (içerik tablolarına dokunmaz).
 * Çalıştırmadan önce yedek alın: `DATABASE_URL` ortamında.
 *
 *   cd api && npx tsx scripts/wipe-user-tables.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.session.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.user.deleteMany(),
    prisma.emailOtpChallenge.deleteMany(),
    prisma.appLog.deleteMany(),
  ]);
  console.log("Tamam: sessions, subscriptions, users, email_otp_challenges, app_logs temizlendi.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
