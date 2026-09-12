---
status: accepted
date: 2026-09-12
---

# Links live on the Product's own domain, tagged URL by default

Reddit and X down-rank shared shortener domains and readers distrust them, so Sluicy never issues links on a Sluicy-owned domain. A Link is a URL on the Product's own domain: by default a tagged URL using the `ref` query convention that Plausible and Datafast also recognize, so it works with no code and coexists with the founder's other analytics; optionally a pretty redirect under a configurable prefix served by the SDK route once it is installed. Both forms are the same Link in the Ledger.

## Considered options

- Shared short domain (the Dub default): rejected for trust and platform ranking.
- Redirect only: rejected because links would not work until the SDK route is installed.
- Tagged URL only: acceptable, but pretty redirects are cleaner in posts and cost little once the route exists.

## Consequences

Slugs are readable, suggested by a model from the Piece title, and frozen after the first click so history never breaks. Pieces published through Postiz get their Link inserted automatically.
