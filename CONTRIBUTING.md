# Contributing to Sluicy

Thanks for considering it. A few things that make contributions land smoothly.

## Before you start

- Read [SPEC.md](./SPEC.md) for what is in and out of scope. The non-goals are deliberate.
- Use the terms in [CONTEXT.md](./CONTEXT.md) in code, comments and issues: Account, Product, Visitor, User, Customer, Piece, Placement, Source, Link, Cluster, Ledger, Weekly Page, Brief.
- Decisions that are hard to reverse are recorded in [docs/adr](./docs/adr). Propose a new ADR before changing one of those.

## Ground rules

- TypeScript everywhere, strict mode on.
- Event tables are only queried through `packages/storage`.
- No new required services. Postgres is the only one; if a feature needs Redis or a queue, use pg-boss.
- Keep the browser snippet under 5 KB.
- Open an issue before a large pull request so the direction is agreed first.

## Workflow

```sh
pnpm install
pnpm typecheck
pnpm build
```

Small, focused pull requests with a clear description of the user-visible change. Reference the spec section or issue.

## Support

Self-hosting support is community-only, through GitHub Discussions and issues. There is no SLA.
