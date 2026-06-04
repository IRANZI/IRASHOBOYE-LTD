const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

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

async function main() {
  const migrationPath = path.join(
    __dirname,
    "..",
    "prisma",
    "migrations",
    "20260604120000_add_admin_and_printed_status",
    "migration.sql",
  );
  const sql = fs.readFileSync(migrationPath, "utf8");
  const statements = sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }

  console.log("Database changes applied.");
}

main()
  .catch((error) => {
    console.error("Failed to apply database changes:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
