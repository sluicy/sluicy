# Sluicy — Product Spec

Version 0.3, 2026-09-13. Owner: Tomáš. Supersedes v0.2. Change in v0.3: Opportunities (section 8.8) close the front of the loop; see [ADR 0004](./docs/adr/0004-opportunities-scan-conversations-not-competitors.md).

Glossary: [CONTEXT.md](./CONTEXT.md). Decisions: [docs/adr](./docs/adr).

## 1. One-liner

Growth analytics and a weekly planning loop for founders who market with content, not ads. The founder writes. Sluicy tracks every visit, every Piece of content and every Link to Signups, revenue and retention, learns what pays, finds the conversations worth answering this week, plans, and schedules through the tools the founder already uses.

**Result we sell:** know where to post this week and which posts pay. Stop wasting time on the rest.

**Principle:** the founder does what matters, the tool does the rest.

**Direction:** growth first, general analytics second. Later versions add more automation toward running growth on autopilot, with writing always left to the founder.

## 2. Problem

Indie and solo founders cannot afford ads and rely on content: X posts and articles, Reddit answers, LinkedIn, YouTube, newsletters. They post inconsistently and have no honest answer to "which post made money."

Existing tools fail them in specific ways:

- Web analytics attribute by referrer and UTM. Datafast is the closest competitor and adds Stripe revenue by source. None of them close the loop into what to publish next, none are open source with agent access, and none connect to the scheduler.
- Schedulers (Postiz, Buffer, Typefully) report views, likes and followers. Nothing connects a post to a signup or a dollar.
- Link tools (Dub) track clicks and conversions per link but stop at "which link," not "which kind of content, and should I make more of it."
- AI content tools generate posts that platforms bury and readers ignore.

Nobody closes the loop: find where to post, publish, measure revenue, learn, decide, publish again. Measurement alone is a vitamin; the painkiller is the decision it drives, and the first decision every week is where to post.

## 3. Who it is for

**Primary:** solo and indie founders with a web product that takes payment through Stripe, who post content themselves and have under roughly 500 paying customers. Comfortable with a script tag and a webhook. Many already use a coding agent.

**Secondary (later):** small marketing teams and agencies managing content for several products.

**Not for:** teams running paid acquisition as the main channel, mobile-only apps, companies wanting product analytics, session replay or a CRM.

## 4. Positioning and principles

1. **Revenue, not views.** Every metric ends in money or retained money. Views appear only as a denominator.
2. **Founder writes, tool does the rest.** Measuring, learning, planning and scheduling are automated. Writing is never automated. Output is Briefs, not posts.
3. **Scheduler-agnostic.** Sluicy never publishes to a social platform itself. It reads from and pushes drafts into schedulers.
4. **Honest attribution.** Every number states its model and its confidence. "Not enough data" is a valid and common answer. What the tracking cannot see is stated, not hidden.
5. **Agent-native.** The MCP server is a first-class interface, equal to the web UI.
6. **Open source, self-hostable.** AGPL. Hosted and self-host ship from one codebase; whatever works hosted works self-hosted.
7. **Narrow on purpose.** See non-goals.

## 5. Goals and success metrics

| Goal | Target | Horizon |
|---|---|---|
| Hosted MRR | $10,000 | 18 months from launch |
| Activation | first attributed payment within 14 days of install | 60% of installs |
| Loop engagement | Weekly Page opened or read via MCP | 50% of active Accounts each week |
| Opportunity conversion | Opportunities answered per Account per week | median of 2 |
| Attribution accuracy | revenue in Sluicy vs Stripe, per Product | within 2% |
| Monthly churn | | under 7% |

## 6. Scope

### 6.1 MVP, in order of shipping

Each milestone is usable on its own.

1. **Web analytics and attribution core.** Script, collector, pageviews with URL, country and device, first and last Touch, Signup call, Stripe webhook and backfill, revenue and churn per Source, reconciliation.
2. **Content Ledger.** Pieces, tagged Links, automatic attributes, the Ledger with charts and trends per Piece.
3. **Weekly Page.** Earned, wasted, repeat, test, stop, with confidence. Web, email and MCP.
4. **Opportunities.** Live conversations on Reddit and Hacker News that match the topics the Product earns from, ranked, each with the Brief to answer it. In the app, on the Weekly Page and through MCP.
5. **Public page and badge.** Opt-in per Product.
6. **Postiz integration.** Auto-created Pieces and Links, Briefs pushed as drafts.
7. **MCP server** with OAuth for agents and API keys for scripts.
8. **Hosted billing** on usage tiers.
9. **ClickHouse storage implementation** behind the storage interface.

### 6.2 Later

- Cookieless tracking mode.
- Pretty redirect Links on the founder's domain once the SDK route is installed (may land inside the MVP if cheap).
- Typefully and Buffer integrations.
- X and LinkedIn as Opportunity sources, once their API cost is justified by paying Accounts.
- Polar and Lemon Squeezy payment providers.
- Cross-Product anonymized benchmarks by niche and Format.
- Team tier: seats, roles, agency view.
- LLM citation monitoring.
- Cost input per Source for CAC and payback.
- Further automation toward growth on autopilot.

### 6.3 Non-goals

- A scheduler or any direct social platform publishing. Integrations, never a scheduler of our own, at least through the initial release.
- Product analytics, session replay, heatmaps, in-app funnels.
- AI-written posts. The founder, or the founder's own agent through MCP, drafts; Sluicy never ships a drafting editor.
- Competitor content scraping. Opportunities scan conversations for questions, never competitors' content or audiences.
- Mobile app attribution.
- Ad platform integrations.
- A "where did you hear about us" survey. Dropped in the v0.2 review; can return as an optional component.

## 7. Core concepts

See [CONTEXT.md](./CONTEXT.md) for definitions. The relationships:

- An **Account** owns many **Products**. Billing is per Account.
- A **Product** is one set of domains (root landing page plus app subdomain) and one Stripe connection.
- A **Visitor** produces **Pageviews** and **Touches**. A Touch carries a **Source**: a Link, a referring domain, a UTM set, an AI assistant, or direct.
- A **Signup** turns a Visitor into a **User**. A payment turns a User, or a pay-first buyer, into a **Customer**.
- A **Piece** has a **Placement** and a **Format** and owns one or more **Links**. Pieces sharing Placement and Format form a **Cluster**.
- The **Ledger** joins Pieces to Touches, Signups, Customers and revenue. The **Weekly Page** is generated from Clusters. A **Brief** is produced for each repeat and test.
- An **Opportunity** is a live conversation on a Placement that matches a Topic the Product earns from. Answering one creates a Piece, so the answer is measured like anything else.

## 8. Feature specifications

### 8.1 Web analytics and attribution core

**Domains.** A Product declares its registrable domain. The landing page on the root and the app on a subdomain share one Visitor cookie set on the registrable domain. Unrelated domains are out of scope for v1.

**SDK route.** The founder's Node or TypeScript backend mounts one route prefix from the SDK. It serves the collector endpoint, the Link redirects, and sets the Visitor cookie server-side so it survives Safari's seven-day cap on script-set storage. The snippet only ever talks to this route on the Product's own domain, which also keeps ad blockers out of the path.

**Script.** Under 5 KB, one tag. Records pageviews with path, referrer, UTMs, `ref`, screen class, and country resolved from the request IP at the collector. The IP is not stored. Referrers from chatgpt.com, perplexity.ai, claude.ai, gemini.google.com and copilot.microsoft.com are classified as Source "AI assistant."

**Touches.** A Touch is recorded when a Visitor arrives with a Source. Each Visitor keeps a first Touch and a last Touch.

**Signup.** `sluicy.signup(userId, { email? })` from the founder's backend, with the Visitor id read from the cookie. Binds Visitor to User. If the founder never calls it and a Stripe customer's email matches a known User, the link is made and labeled "matched by email." Email matches never count toward the reconciliation accuracy claim.

**Stripe.** Per Product, the founder creates a restricted API key with read-only access to charges and refunds, customers, balance, checkout sessions, subscriptions and invoices, and a webhook endpoint in their dashboard. Sluicy stores the key and the webhook secret. Both orders are supported: signup then pay, and pay-first through a Payment Link or Checkout Session carrying the Visitor id in `client_reference_id`, with the User attached later by the Signup call. Webhooks: `checkout.session.completed`, `invoice.paid`, `charge.refunded`, `customer.subscription.deleted`. A backfill imports the last 90 days of payments on connection. Revenue is net of refunds, kept in the Product's currency, converted daily to the Account's reporting currency, USD by default.

**Attribution model.** First Touch is the default for content decisions. Last Touch is always shown alongside. Window: 30 days from Touch to Signup, editable per Product; the cookie lives at least that long. A Signup with no Touch inside the window is Unattributed and is never redistributed.

**Reconciliation.** Nightly, per Product: Sluicy revenue events against Stripe balance transactions. The UI shows the match rate. Below 98% raises an alert listing the unmatched transactions.

**Stated blind spots.** Cross-device journeys are not stitched. The Weekly Page shows the share of Unattributed Signups and says what it means.

### 8.2 Content Ledger

**Create a Piece.** From the UI, from the MCP server, or automatically from the Postiz publish webhook. Input: URL or text, Placement, publish date. A model proposes Format, topic, hook and CTA; the founder edits. Placement, Format and CTA come from closed lists. Topic and hook are model-normalized text.

**Links.** Each Piece owns one or more Links, each with a destination anywhere on the Product's domains. Default form is a tagged URL using the `ref` convention: `https://example.com/sign-up?ref=reddit-attribution`. It works with no code and is read correctly by Plausible and Datafast too. Once the SDK route is detected, a pretty redirect `https://example.com/go/reddit-attribution` is offered for the same Link; the prefix is configurable. The slug is suggested by the model from the Piece title, editable, and frozen after the first click.

**Ledger view.** Always visible, regardless of data volume. Per Piece: Placement, Format, published date, clicks, visits, Signups, Customers, revenue, retained revenue at 30, 60 and 90 days, with a trend chart per Piece. Aggregations by Placement, Format and Cluster. Visits and Signups within 7 days of publish are the leading layer; revenue and retention are the lagging layer. Both are always shown.

### 8.3 Weekly Page

Generated every Monday per Product in the Account's timezone. Sections: Earned (top three Pieces by revenue, trailing 30 days), Wasted (top three by visits with zero Signups), Repeat, Test, Stop, and Confounders from Annotations.

**Decision rules (v1, tunable).**

- *Repeat:* a Cluster with at least 3 Pieces, at least 10 Signups, Signup rate at least 1.5× the Product median, revenue greater than zero.
- *Stop:* a Cluster with at least 3 Pieces, at least 500 combined visits, zero revenue in 30 days, Signup rate under 0.5× median.
- *Test:* the Cluster with the highest median Signup rate among Clusters with fewer than 3 Pieces.
- *Insufficient data:* under 20 attributed Signups in the trailing 60 days. The page says so, shows Earned and Wasted only, and suggests a posting cadence to reach a signal.
- *Decay:* a Repeat Cluster whose Signup rate falls three weeks running is flagged and moved to Test.
- *Exploration:* at least one Test even when a Repeat exists.

Every recommendation shows the numbers behind it and a one-line confidence statement. Delivered as web page, email, MCP resource and JSON.

### 8.4 Briefs

For each Repeat and Test: the angle, the hook that worked with its numbers, the CTA, the Placement and Format, and the three best Pieces in the Cluster. No drafted body. Pushable to a scheduler as a draft with a Link pre-inserted.

### 8.5 Postiz integration

Through the Postiz REST API and its publish webhook. The founder pastes a Postiz API key. On each publish webhook, Sluicy creates the Piece with its Placement and public URL and inserts a Link; the posts endpoint is polled hourly as a safety net because the webhook has no retry. Per-post impressions and likes are read from the analytics endpoint for the views-to-revenue ratio. Briefs are created as Postiz drafts. Sluicy does not use the Postiz MCP server.

### 8.6 MCP server

Tools: `list_pieces`, `get_ledger`, `get_weekly_page`, `list_opportunities`, `claim_opportunity`, `create_piece`, `create_link`, `push_brief`, `add_annotation`. Resources: the Weekly Page, the Ledger as CSV. Agents connect with OAuth 2.1 and dynamic client registration; scripts and the CLI use API keys. Both are per Account, scoped read or write, revocable in settings. A skill file for Claude Code, OpenClaw and Hermes runs the loop: read the Weekly Page, draft Briefs, push drafts, ask the human to approve. `npx sluicy init` installs the snippet and the SDK route in a Node project.

### 8.7 Public page

Opt-in per Product. Shows visits, Signups and revenue by Source and by top Pieces, with a badge linking to Sluicy. Real revenue shown by default with a switch to hide amounts. Rendered on the server so link previews on X and LinkedIn carry a title and image.

### 8.8 Opportunities

The front of the loop: where to post this week. Sluicy watches conversations and surfaces the ones worth answering, with the evidence for why.

**Sources.** Reddit through the official Data API and Hacker News through the Algolia search API in v1. Both are polled by the worker; nothing is scraped. X and LinkedIn are later additions gated on API cost. Sources sit behind one interface so adding one never touches ranking or delivery.

**What is watched.** Per Product, a set of Topics: seeded by the founder at setup from the Product's own description, then grown from the Topics of Pieces in Repeat and Test Clusters. The founder edits the set at any time. Per Topic the worker searches for new threads and questions, at most hourly, respecting each API's rate limits.

**Ranking.** Each Opportunity scores on topic fit, thread activity in its first hours, recency, and the revenue of the Cluster the Topic belongs to. A conversation that matches a paying Cluster outranks one that matches a hunch. Opportunities older than 72 hours expire; late answers are buried on every platform.

**Delivery.** A list in the app, a "This week, answer these" section on the Weekly Page with the top five, and the MCP tools `list_opportunities` and `claim_opportunity`. Each Opportunity carries the thread, the matching Topic with its numbers, and the Brief for that Cluster: the hook that worked, the CTA and the best three Pieces to draw from. The founder or their agent writes the answer.

**Closing the loop.** Claiming an Opportunity creates a Piece with Placement, Format "answer", the Topic and a Link, and marks the Opportunity answered. From then on it is an ordinary Piece: clicks, Signups, revenue, retention, Cluster membership, Weekly Page. Dismissed Opportunities teach the ranking for that Product.

**Cold start.** Works from day one on the founder's seeded Topics with no revenue data. Ranking by Cluster revenue switches on as Clusters earn.

**Honesty.** Sluicy never posts, never drafts the body, never fabricates engagement. It names the source and the time of every Opportunity and says when a source is rate-limited or down.

## 9. Attribution honesty rules

- A first-party cookie is used because Visitor-to-Customer linking is the point. No third-party cookies, no fingerprinting, no cross-site tracking. Cookieless mode is a later addition with stated limits. A consent posture note is provided; legal advice is not.
- Cross-device journeys are not stitched.
- Every number carries its model: first Touch or last Touch. They are never merged into one figure.
- No percentages on fewer than 10 Signups.
- Unattributed is a real category and is never redistributed.

## 10. Architecture

Kept small for one maintainer and friendly to TypeScript contributors.

- **Repository:** pnpm monorepo, TypeScript throughout.
  - `apps/api`: Hono. Collector, Link redirects, Stripe and Postiz webhooks, REST API, MCP server, server-rendered public pages using Hono JSX. A Vite SSR plugin is the fallback if Hono JSX proves limiting.
  - `apps/web`: Vite, React, TypeScript single-page app for the signed-in product.
  - `apps/worker`: reconciliation, Weekly Page generation, backfills, Postiz polling. Jobs on pg-boss, so no Redis.
  - `packages/sdk`: the browser snippet, the Node route handler, the Signup call.
  - `packages/storage`: the event storage interface with a Postgres implementation; ClickHouse is the second implementation, milestone 8.
- **Databases:** Postgres for Accounts, Products, Pieces, Links, revenue events and settings, through Drizzle. Events (Pageviews, Touches) go through the storage interface; the Postgres implementation partitions by month and keeps 13 months.
- **Self-host:** one `docker compose up` with Postgres included, same image as hosted, first signup becomes owner, public registration off by default. SMTP settings required because sign-in is magic link only; Resend optional.
- **Hosted:** Hetzner compute plus a managed Postgres. Revisited when ClickHouse arrives.
- **Model calls:** Claude API for attributes, slugs and Briefs. Hosted includes them with a monthly cap per Account; self-host is bring-your-own key, and every model feature degrades to manual entry without one.
- **Retention:** events 13 months, revenue and identities for the Product's lifetime, per-User deletion that removes the identity and leaves an anonymized revenue row.

## 11. Pricing and packaging

| Tier | Price | Includes |
|---|---|---|
| Self-host | $0 | Full source, AGPL, no contributor agreement, community support only |
| Hosted, usage tiers | from $19/month | Tiered by monthly visits per Account, unlimited Products, Weekly Page by email and MCP, integrations, public page |
| Team | later | Seats, roles, agency view, benchmarks |

Overage policy: warn, never cut off, ask to upgrade. No free hosted tier. Waitlist founders lock their first tier's price.

## 12. Go-to-market

1. **Dogfood in public.** Sluicy's own Ledger and Weekly Page are public from day one and become weekly X articles.
2. **Authority metric.** Post the public page weekly.
3. **AEO.** Listings in agent tool repositories and awesome-lists; real Reddit answers to "how do you know which post converts."
4. **Postiz collaboration.** Ship the integration, then the joint article Nevo David has invited marketing tool builders to write.
5. **Waitlist.** Live. Each signup carries a "where did you find this" answer, which is the first dataset even though the survey is not a product feature.

## 13. Risks

| Risk | Response |
|---|---|
| Datafast adds a planning loop, or Postiz adds revenue attribution | Open source, agent access, scheduler-agnostic, Clusters and retention by content. None are natural for either. |
| Attribution disagrees with Stripe | Reconciliation in milestone 1 with a visible match rate. |
| Cross-device and AI-assistant journeys show as direct | Stated on the Weekly Page; cookieless and survey options are later additions if the share is large. |
| Founders post too little for a signal | Insufficient-data mode with a cadence suggestion. |
| Event volume outgrows Postgres | Storage interface from day one; ClickHouse is milestone 8. |
| Self-host support load | Community only, one Docker command, SMTP the only external requirement. |
| Solo maintainer bandwidth | Non-goals enforced; integrations one at a time. |
| Reddit or X change API terms or pricing | Official APIs only, sources behind one interface, Hacker News is always free, and the product stays useful with the Ledger and Weekly Page alone. |
| Opportunities turn founders into spammers and platforms punish them | At most five per week on the Weekly Page, ranking favours fit over volume, every Opportunity ships with the evidence and the Brief, and the Weekly Page reports the Signup rate of answers so low-quality answering shows up as Wasted. |

## 14. Open questions

1. Domain: sluicy.dev, sluicy.app and sluicy.io were free on 2026-09-12; .com is taken. Trademark search still to do.
2. Hono JSX or a Vite SSR plugin for the public pages, decided by a spike.
3. The row-count threshold that triggers the ClickHouse implementation for a given install.
4. The exact usage tiers and visit boundaries above $19.
5. Consent posture wording for EU founders using cookie mode.
6. Reddit Data API access tier for a hosted service polling on behalf of many Accounts, and whether self-hosters bring their own Reddit app credentials.
7. Whether X joins the Opportunity sources at launch given its API pricing.

## 15. Milestones

| Milestone | Deliverable | Exit criterion |
|---|---|---|
| M0 | Manual loop on own product for one month in a spreadsheet | The weekly plan changed at least one posting decision |
| M1 | Analytics and attribution core | Own product reconciles with Stripe within 2% for 14 days |
| M2 | Content Ledger and Links | 30 days of own content in the Ledger |
| M3 | Weekly Page | First Weekly Page published as an X article |
| M4 | Opportunities on Reddit and Hacker News | Ten Opportunities answered on own product, at least one attributed Signup from an answer |
| M5 | Public page, Postiz, MCP | Ten waitlist founders installed and reached first attributed Signup |
| M6 | Hosted billing on usage tiers | First paying Account |
| M7 | ClickHouse storage implementation | One Product above the threshold runs on it in production |
