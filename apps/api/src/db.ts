import { createDb, type Db } from "@sluicy/db";

let db: Db | null | undefined;

/** The one Postgres connection for the API. Null when DATABASE_URL is unset, so pages can explain instead of crash. */
export function getDb(): Db | null {
  if (db === undefined) db = process.env.DATABASE_URL ? createDb() : null;
  return db;
}
