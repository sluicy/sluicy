import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

export * from "./schema.js";

export function createDb(url = process.env.DATABASE_URL) {
  if (!url) throw new Error("DATABASE_URL is not set");
  return drizzle(postgres(url), { schema });
}

export type Db = ReturnType<typeof createDb>;

/** Applies every migration in packages/db/drizzle. Used by the API on boot in self-host and by integration tests. */
export async function migrate(db: Db, migrationsFolder = new URL("../drizzle", import.meta.url).pathname) {
  const { migrate: run } = await import("drizzle-orm/postgres-js/migrator");
  await run(db, { migrationsFolder });
}
