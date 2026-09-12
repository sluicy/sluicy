---
status: accepted
date: 2026-09-12
---

# Postgres first for events, behind a storage interface, ClickHouse as the second implementation

Open-source analytics tools (Plausible, PostHog, Rybbit, OpenPanel) conventionally run Postgres for application state and ClickHouse for events. Sluicy stores full Pageviews, so volume will eventually demand columnar storage, but a second database in every self-host install and a second query dialect for contributors is a real cost before there are Products that need it. Events therefore go through a storage interface with a partitioned-Postgres implementation first, and ClickHouse is a planned milestone right after hosted billing, not a maybe.

## Considered options

- Postgres plus ClickHouse from day one: the convention, rejected for install and contributor cost before volume exists.
- TimescaleDB: one database with columnar compression, rejected as a third path contributors know least.
- Postgres only forever: rejected because full Pageview storage will outgrow it.

## Consequences

Nothing outside `packages/storage` may query event tables directly. Application tables (Accounts, Products, Pieces, Links, revenue events) stay in Postgres through Drizzle regardless of the event store.
