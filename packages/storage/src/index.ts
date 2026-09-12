// Event storage interface (ADR 0002). Nothing outside this package queries event tables directly.
// Postgres is the first implementation; ClickHouse is the planned second.

export type Source =
  | { kind: "link"; linkId: string }
  | { kind: "referrer"; domain: string }
  | { kind: "utm"; source: string; medium?: string; campaign?: string }
  | { kind: "ai_assistant"; domain: string }
  | { kind: "direct" };

export interface Pageview {
  productId: string;
  visitorId: string;
  path: string;
  referrer?: string;
  country?: string;
  device: "desktop" | "mobile" | "tablet" | "other";
  occurredAt: Date;
}

export interface Touch {
  productId: string;
  visitorId: string;
  source: Source;
  occurredAt: Date;
}

export interface EventStore {
  recordPageview(event: Pageview): Promise<void>;
  recordTouch(event: Touch): Promise<void>;
  /** First and last Touch for a Visitor inside the window, or null when Unattributed. */
  touchesFor(productId: string, visitorId: string, windowDays: number): Promise<{ first: Touch; last: Touch } | null>;
}

export { PostgresEventStore } from "./postgres.js";
