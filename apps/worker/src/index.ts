import PgBoss from "pg-boss";

// Jobs run on pg-boss so self-host needs no Redis (SPEC section 10).
// Each queue maps to a milestone; handlers are stubs until that milestone lands.
const QUEUES = {
  reconcileStripe: "reconcile-stripe", // nightly, per Product (M1)
  backfillStripe: "backfill-stripe", // on connection, last 90 days (M1)
  generateWeeklyPage: "generate-weekly-page", // Mondays, per Product (M3)
  pollPostiz: "poll-postiz", // hourly safety net for the publish webhook (M4)
} as const;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const boss = new PgBoss(url);
  boss.on("error", (err) => console.error("pg-boss", err));
  await boss.start();

  for (const name of Object.values(QUEUES)) {
    await boss.createQueue(name);
    await boss.work(name, async ([job]) => {
      console.log(`[${name}] received`, job?.data);
    });
  }

  await boss.schedule(QUEUES.reconcileStripe, "0 3 * * *", {});
  await boss.schedule(QUEUES.generateWeeklyPage, "0 6 * * 1", {});
  await boss.schedule(QUEUES.pollPostiz, "0 * * * *", {});

  console.log("sluicy worker started");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
