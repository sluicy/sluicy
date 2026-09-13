# Sluicy

Open-source (AGPL-3.0) growth analytics for founders who market with content. It tracks link → visit → signup → Stripe revenue, learns which content pays, and produces a Weekly Page of what to repeat, test and stop. Pre-alpha: the spec is done, the code is a scaffold.

Read before changing behaviour:

- `README.md` for the architecture table, dev commands and hosting.
- `CONTEXT.md` for the domain vocabulary. Use those exact terms (Account, Product, Visitor, Piece, Placement, Link, Touch, Cluster, Weekly Page) in code, comments and tests. Each entry lists words to avoid.
- `SPEC.md` for scope and the deliberate non-goals. Sluicy is not a scheduler, not product analytics, not an AI ghostwriter.
- `docs/adr/` for decisions that are hard to reverse. Propose a new ADR before changing one.

## Hard rules

- TypeScript strict everywhere; `tsconfig.base.json` is the single source of compiler options.
- Event tables are read and written only through `packages/storage`.
- Postgres is the only required service. Background work goes through pg-boss, never Redis or a separate queue.
- The browser snippet in `packages/sdk` stays under 5 KB.
- Hosted and self-hosted run the same image; a feature that only works hosted is a spec change, not a code change.
- The REST API is defined once, as `@hono/zod-openapi` routes in `apps/api`. Its OpenAPI document is committed at `apps/api/openapi.json` and the web app talks to it only through the generated `apps/web/src/api/schema.ts` with openapi-fetch and react-query (`apps/web/src/api/client.ts`). After changing a route, run `pnpm api:schema`; CI fails on drift. No hand-written fetch calls in `apps/web`.

## Code structure

**Modules.** Organise by feature, not by layer. A module is one folder that holds everything for one concern: routes, page, styles, data access, tests. `apps/api/src/landing/` is the template: `routes.tsx`, `page.tsx`, `styles.ts`, `waitlist.ts` side by side. A new concern (links, collector, weekly page) gets its own folder in the same shape. A module exports one small surface from its index; other modules use that surface and nothing inside.

**Co-location.** Put code next to the only code that uses it. A helper used by one route lives in that route's module. Promote to a shared place only when sharing is semantically justified: a second module needs the same rule and both must evolve together. Small local duplication beats a premature abstraction.

**Simplicity, YAGNI.** Solve the case in front of you. Add abstraction, configuration, generics or indirection when a second concrete use exists, not before. No speculative layers, generic frameworks or extensibility points. Prefer a plain function over a class, a plain object over a builder, an inline expression over a one-line helper. When two implementations would work, choose the one with fewer moving parts.

**Single source of truth.** Each rule, constant, type and query lives in exactly one place. Before writing something, search for it; extend what exists. Consolidate only rules that are truly identical and must change together; two rules that merely look alike today stay separate. Types come from the Drizzle schema in `packages/db`, never hand-copied.

**Functions and control flow.** Keep each function focused on one behaviour and name it for that behaviour, not for its parameters. Prefer early returns and flat control flow over nesting. Closed lists (Placement, Format, event kinds) are string literal unions; if a numeric enum is ever unavoidable, give every member an explicit value so stored values never depend on declaration order.

**Naming and comments.** Files and folders are lowercase-kebab, named after the domain term they hold; a reader finds the Weekly Page code by looking for `weekly-page`. Variables and functions get short, descriptive names. When a name alone cannot carry the purpose, add a comment with the non-obvious behaviour or constraint. Comments say why a decision exists, never what the code already says. Exported functions and every method of an exported interface carry a JSDoc line stating what it does and any contract a caller could get wrong (single use, ordering, what is stored).

## Web UI (`apps/web`)

Tailwind v4 and shadcn (`components.json`, radix-nova preset). Primitives live in `src/components/ui/` and are added with `pnpm dlx shadcn@latest add <name>` from `apps/web`, never hand-written. Composed reusable components live in `src/components/`. Theme tokens are the CSS variables in `src/styles.css`; they mirror the landing palette and there is one theme, dark. Style with Tailwind classes on those tokens (`bg-primary`, `text-muted-foreground`); no ad-hoc hex values and no separate CSS files. Every reusable component has a story beside it (`<name>.stories.tsx`, `pnpm --filter @sluicy/web storybook`); page-level components do not. Import app code through the `@/` alias.

## Testing (backend: `apps/api`, `apps/worker`, `packages/*`)

Test runner is Vitest, added to a package the first time it gets a test. Tests live beside the code they test as `<name>.test.ts`, inside the module.

- **Unit tests** for pure logic: attribution windows, cluster maths, reconciliation rules, brief generation. Inputs in, outputs out, no database.
- **Integration tests** for anything that touches Postgres, Hono routes or pg-boss jobs. Run against the real Postgres from `docker compose`, on a schema created by the Drizzle migrations. Exercise the module through its public surface: send the HTTP request, run the job, then read the database.

A test earns its place by pinning behaviour a reader could get wrong: a boundary, a business rule from `SPEC.md`, a bug that was fixed. Name it after the behaviour (`attributes signup to last touch inside the window`). Skip tests that restate the implementation, check a mock was called, or assert a type the compiler already checks. Every rule in the spec that the code implements has one test that fails when the rule breaks.

## Before finishing

Run `pnpm typecheck` and the tests for every package you touched. CI runs typecheck and build on every push; a change that passes locally but skips a test is not done.
