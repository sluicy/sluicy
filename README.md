# Sluicy

**Open-source growth analytics for founders who market with content, not ads.**
Find the content that pays. Stop the rest.

You write. Sluicy tracks every visit, every piece of content and every link to signups, Stripe revenue and retention, learns what pays, plans next week, and pushes briefs into the scheduler you already use.

> Status: pre-alpha. The spec is done, the code is a scaffold. Follow along or join the [waitlist](https://sluicy.dev).

## Why

Web analytics tell you where visitors came from. Schedulers tell you how many likes a post got. Nothing tells a solo founder *which post made money* or what to publish next week. Sluicy closes that loop:

1. **Publish** through Postiz, Typefully or Buffer, with a trackable link per piece.
2. **Measure** link → visit → signup → payment → retained revenue, reconciled against Stripe.
3. **Learn** which placement and format convert, not per post but per cluster, with confidence stated.
4. **Plan** a Weekly Page: what earned, what wasted effort, what to repeat, test and stop.
5. **Write** the next piece yourself. That is the one step Sluicy never automates.

Read the full [product spec](./SPEC.md), the [glossary](./CONTEXT.md) and the [decision records](./docs/adr).

## What it is not

Not a scheduler. Not product analytics or session replay. Not an AI ghostwriter. Not a competitor scraper. Not for ad attribution.

## Architecture

pnpm monorepo, TypeScript throughout.

| Path | What |
|---|---|
| `apps/api` | Hono. Landing page and waitlist at `/`, collector, link redirects, Stripe and Postiz webhooks, REST API, MCP server, server-rendered public pages. All pages are Hono JSX rendered on the server. |
| `apps/web` | Vite + React single-page app for the signed-in product. |
| `apps/worker` | pg-boss jobs: reconciliation, Weekly Page generation, backfills, Postiz polling. No Redis. |
| `packages/sdk` | The `sluicy` npm package: browser snippet, server route handler, Signup call. |
| `packages/db` | Drizzle schema for accounts, products, pieces, links, users, revenue events. |
| `packages/storage` | Event storage interface. Postgres first, ClickHouse planned. Nothing else touches event tables. |

Hosted and self-hosted run the same image. Postgres is the only required service; magic-link sign-in needs SMTP.

## Development

Requires Node 22+ and pnpm 10+.

```sh
pnpm install
cp .env.example .env
pnpm db:up          # Postgres in Docker
pnpm dev            # api on :8787, web on :5173, worker
```

Other scripts: `pnpm typecheck`, `pnpm build`, `pnpm test` (the API's tests need the Docker Postgres; they create and migrate a `sluicy_test` database), `pnpm --filter @sluicy/db db:generate` (new migration from the schema), `pnpm --filter @sluicy/db db:migrate` (apply migrations to `DATABASE_URL`).

The landing page is served by the API at `http://localhost:8787/`. Its waitlist form writes to the `waitlist` table, so run the migration first; without a database the form explains that it is not connected.

### Signing in

The signed-in app lives at `APP_URL` (`app.sluicy.dev` in production, `http://localhost:5173` in dev, where Vite proxies `/v1` to the API). Sign-in is magic link only: the React page at `/sign-in` posts to `/v1/auth/sign-in`, the emailed link opens `/sign-in/verify`, which consumes the token with a POST so mail scanners cannot burn it. With no `SMTP_URL` or `RESEND_API_KEY` set, the dev server prints the link to its console instead. The first sign-in on an instance creates the owner Account; after that `REGISTRATION=closed` (the default) only lets existing Accounts in, and `REGISTRATION=open` lets anyone sign up. See `.env.example`.

## Hosting

**Now (waitlist only):** the landing page runs as a Cloudflare Worker with the waitlist in a free D1 database. Same Hono page as the Node server, different entry (`apps/api/src/worker.ts`). One-time setup, from `apps/api`:

```sh
pnpm exec wrangler login
pnpm exec wrangler d1 create sluicy-waitlist        # paste the printed database_id into wrangler.jsonc
pnpm --filter @sluicy/api landing:migrate            # create the table
pnpm --filter @sluicy/api landing:deploy             # live on <name>.workers.dev; add sluicy.dev as a custom domain in the dashboard
```

Later pushes deploy automatically through `.github/workflows/deploy-landing.yml` once the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets and the `LANDING_DEPLOY_ENABLED=true` variable are set on the repository. `pnpm --filter @sluicy/api landing:export` dumps the waitlist for the move to Postgres.

**Later (the app):** one Hetzner server with Coolify running the API, worker, web app and Postgres from this repo's Docker image. The API serves the built web app from `WEB_DIST` at `app.sluicy.dev`, so the SPA and the JSON API share one origin and one session cookie. Details in [SPEC.md](./SPEC.md#10-architecture).

## Self-hosting

One `docker compose up` with Postgres included, first signup becomes the owner, public registration off by default. Packaging lands with the first usable milestone; until then, run it from source as above.

## Roadmap

Milestones from the spec, in order: attribution core with Stripe reconciliation → content ledger and links → Weekly Page → public page, Postiz and MCP → hosted billing → ClickHouse storage. Details in [SPEC.md](./SPEC.md#15-milestones).

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) first; the glossary in [CONTEXT.md](./CONTEXT.md) is the vocabulary used in code and issues.

## License

[AGPL-3.0](./LICENSE). Use it, self-host it, change it; if you offer a modified version as a service, share the source. No contributor license agreement.
