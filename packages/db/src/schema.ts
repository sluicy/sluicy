// Application tables. Event tables (Pageviews, Touches) live behind @sluicy/storage, never here.
// Vocabulary follows CONTEXT.md: Account, Product, User, Customer, Piece, Link.
import { pgTable, text, timestamp, uuid, integer, jsonb, boolean } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  /** The first Account created on an instance. Self-host: owner administers the instance (SPEC 10). */
  isOwner: boolean("is_owner").notNull().default(false),
  reportingCurrency: text("reporting_currency").notNull().default("USD"),
  timezone: text("timezone").notNull().default("UTC"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  name: text("name").notNull(),
  /** Registrable domain, e.g. "talkbase.io". Root landing page and app subdomain share the Visitor cookie. */
  domain: text("domain").notNull(),
  attributionWindowDays: integer("attribution_window_days").notNull().default(30),
  linkPrefix: text("link_prefix").notNull().default("/go/"),
  publicPageEnabled: boolean("public_page_enabled").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pieces = pgTable("pieces", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id),
  title: text("title").notNull(),
  url: text("url"),
  /** Closed list, see CONTEXT.md "Placement". */
  placement: text("placement").notNull(),
  /** Closed list, see CONTEXT.md "Format". */
  format: text("format"),
  topic: text("topic"),
  hook: text("hook"),
  cta: text("cta"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const links = pgTable("links", {
  id: uuid("id").primaryKey().defaultRandom(),
  pieceId: uuid("piece_id").notNull().references(() => pieces.id),
  productId: uuid("product_id").notNull().references(() => products.id),
  /** Readable, model-suggested, frozen after the first click (ADR 0003). */
  slug: text("slug").notNull(),
  destination: text("destination").notNull(),
  clicks: integer("clicks").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id),
  /** The Product's own user id, passed in the Signup call. */
  externalId: text("external_id").notNull(),
  email: text("email"),
  visitorId: text("visitor_id"),
  firstTouch: jsonb("first_touch"),
  lastTouch: jsonb("last_touch"),
  signedUpAt: timestamp("signed_up_at", { withTimezone: true }).notNull().defaultNow(),
});

export const revenueEvents = pgTable("revenue_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id),
  userId: uuid("user_id").references(() => users.id),
  provider: text("provider").notNull().default("stripe"),
  providerEventId: text("provider_event_id").notNull().unique(),
  kind: text("kind").notNull(), // payment | refund | cancel
  amountMinor: integer("amount_minor").notNull(),
  currency: text("currency").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
});

/** One-time sign-in tokens. Sign-in is magic link only (SPEC 10). Only the SHA-256 of the token is stored. */
export const magicLinks = pgTable("magic_links", {
  tokenHash: text("token_hash").primaryKey(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Browser sessions for the signed-in app. The cookie carries the raw id; the table stores its SHA-256. */
export const sessions = pgTable("sessions", {
  idHash: text("id_hash").primaryKey(),
  accountId: uuid("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Pre-launch waitlist, written by the landing page at "/". Keyed by email so repeat signups do not duplicate. */
export const waitlist = pgTable("waitlist", {
  email: text("email").primaryKey(),
  form: text("form"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
