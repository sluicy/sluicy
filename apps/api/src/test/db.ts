import postgres from "postgres";
import { createDb, migrate, type Db } from "@sluicy/db";

/**
 * A migrated test database for integration tests. Uses TEST_DATABASE_URL, else the docker-compose Postgres with a
 * separate `sluicy_test` database that is created on first use. Tables are truncated between tests by `reset`.
 */
export async function testDb(): Promise<{ db: Db; reset: () => Promise<void>; close: () => Promise<void> }> {
  const url = process.env.TEST_DATABASE_URL ?? "postgres://sluicy:sluicy@localhost:5432/sluicy_test";
  await ensureDatabase(url);
  const db = createDb(url);
  await migrate(db);
  const sql = postgres(url);
  return {
    db,
    reset: async () => {
      await sql`truncate table sessions, magic_links, accounts, waitlist restart identity cascade`;
    },
    close: async () => {
      await sql.end();
    },
  };
}

async function ensureDatabase(url: string) {
  const target = new URL(url);
  const name = target.pathname.slice(1);
  target.pathname = "/postgres";
  const admin = postgres(target.toString());
  const exists = await admin`select 1 from pg_database where datname = ${name}`;
  if (exists.length === 0) await admin.unsafe(`create database "${name}"`);
  await admin.end();
}
