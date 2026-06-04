const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("crypto");

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return undefined;

  try {
    const url = new URL(databaseUrl);

    if (url.hostname.includes("pooler.supabase.com")) {
      url.searchParams.set("pgbouncer", "true");
      url.searchParams.set("connection_limit", url.searchParams.get("connection_limit") || "1");
    }

    return url.toString();
  } catch {
    return databaseUrl;
  }
}

const prisma = new PrismaClient({
  datasources: getDatabaseUrl()
    ? {
        db: {
          url: getDatabaseUrl(),
        },
      }
    : undefined,
});

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt$${salt}$${hash}`;
}

async function main() {
  const username = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";

  await prisma.admin.upsert({
    where: { username },
    update: {
      passwordHash: hashPassword(password),
    },
    create: {
      username,
      passwordHash: hashPassword(password),
    },
  });

  console.log("Admin user seeded.");
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((error) => {
    console.error("Failed to seed admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
