import postgres from "postgres";
import type { EventStore, Pageview, Touch } from "./index.js";

/**
 * Postgres implementation. Tables are partitioned by month and kept 13 months;
 * the DDL lives in migrations, not here. This is a scaffold: the queries are the
 * contract, the tables do not exist yet.
 */
export class PostgresEventStore implements EventStore {
  private sql: ReturnType<typeof postgres>;

  constructor(url: string) {
    this.sql = postgres(url);
  }

  async recordPageview(e: Pageview): Promise<void> {
    await this.sql`
      insert into pageviews (product_id, visitor_id, path, referrer, country, device, occurred_at)
      values (${e.productId}, ${e.visitorId}, ${e.path}, ${e.referrer ?? null}, ${e.country ?? null}, ${e.device}, ${e.occurredAt})
    `;
  }

  async recordTouch(e: Touch): Promise<void> {
    await this.sql`
      insert into touches (product_id, visitor_id, source, occurred_at)
      values (${e.productId}, ${e.visitorId}, ${this.sql.json(e.source as never)}, ${e.occurredAt})
    `;
  }

  async touchesFor(productId: string, visitorId: string, windowDays: number) {
    const rows = await this.sql<{ source: Touch["source"]; occurred_at: Date }[]>`
      select source, occurred_at from touches
      where product_id = ${productId} and visitor_id = ${visitorId}
        and occurred_at > now() - (${windowDays} || ' days')::interval
      order by occurred_at asc
    `;
    const first = rows[0];
    const last = rows[rows.length - 1];
    if (!first || !last) return null;
    return {
      first: { productId, visitorId, source: first.source, occurredAt: first.occurred_at },
      last: { productId, visitorId, source: last.source, occurredAt: last.occurred_at },
    };
  }
}
