import { db } from "./index";
import { parcels, mutationApplications, auditLogs } from "./schema";
import { SEED_PARCELS, SEED_MUTATIONS, SEED_AUDIT_LOGS } from "./seed-data";
import { count } from "drizzle-orm";

export async function ensureDatabaseSeeded() {
  try {
    const [{ value }] = await db.select({ value: count() }).from(parcels);
    if (value === 0) {
      console.log("Seeding initial Land Stack demo records...");
      await db.insert(parcels).values(SEED_PARCELS);
      await db.insert(mutationApplications).values(SEED_MUTATIONS);
      await db.insert(auditLogs).values(SEED_AUDIT_LOGS);
      console.log("Seeding complete!");
    }
  } catch (error) {
    console.error("Database seed check error:", error);
  }
}
