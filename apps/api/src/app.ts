import { Hono } from "hono";
import { logger } from "hono/logger";
import { publicPages } from "./public-pages.js";
import { landing } from "./landing/routes.js";

export const app = new Hono();

app.use(logger());

app.get("/health", (c) => c.json({ ok: true, service: "sluicy-api" }));

// Landing page and waitlist, server-rendered with Hono JSX (SPEC 8.7 applies the same to public pages).
app.route("/", landing);

// v1 API. Each group is a milestone in SPEC.md section 6.1; only the shapes exist today.
const v1 = new Hono();
v1.post("/collect", (c) => c.body(null, 204)); // M1: pageviews and touches into @sluicy/storage
v1.post("/signup", (c) => c.json({ ok: true })); // M1: bind Visitor to User
v1.get("/links/:slug", (c) => c.json({ error: "not_found" }, 404)); // M2: Link lookup for SDK redirects
v1.post("/webhooks/stripe", (c) => c.json({ received: true })); // M1: revenue events
v1.post("/webhooks/postiz", (c) => c.json({ received: true })); // M4: auto-created Pieces
app.route("/v1", v1);

// Server-rendered public pages (SPEC 8.7) so link previews carry a title and image.
app.route("/p", publicPages);
