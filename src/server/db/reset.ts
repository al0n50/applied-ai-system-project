import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

// Load environment variables
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
config();

async function reset() {
  const db = drizzle(process.env.DATABASE_URL!);

  console.log("🗑️  Dropping all tables...");

  // Drop tables in correct order (respecting foreign key constraints)
  await db.execute(sql`DROP TABLE IF EXISTS rentability_rental CASCADE`);
  await db.execute(
    sql`DROP TABLE IF EXISTS rentability_service_unavailable_dates CASCADE`,
  );
  await db.execute(sql`DROP TABLE IF EXISTS rentability_service CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS rentability_business CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS rentability_session CASCADE`);
  await db.execute(
    sql`DROP TABLE IF EXISTS rentability_verification_token CASCADE`,
  );
  await db.execute(sql`DROP TABLE IF EXISTS rentability_account CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS rentability_user CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS rentability_svc_block CASCADE`);

  console.log("✅ Database reset successfully!");
  console.log("💡 Run 'pnpm db:push' to recreate tables");
  process.exit(0);
}

reset().catch((error) => {
  console.error("❌ Error resetting database:", error);
  process.exit(1);
});
