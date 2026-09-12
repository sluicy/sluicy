import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import type { Db } from "@sluicy/db";
import type { Config } from "./config.js";
import { createAuthRoutes, createAuthService, requireSession, type Mailer } from "./auth/index.js";
import { publicPages } from "./public-pages.js";
import { createLanding } from "./landing/routes.js";
import { joinWaitlist } from "./landing/waitlist.js";

export type AppDeps = { config: Config; db: Db | null; mailer: Mailer };

/** Builds the API. Dependencies are injected so tests can pass a test database and a capturing mailer. */
export function createApp({ config, db, mailer }: AppDeps) {
  const app = new Hono();
  app.use(logger());

  app.get("/health", (c) => c.json({ ok: true, service: "sluicy-api" }));

  // The signed-in app (SPA) lives at config.appUrl. In production the API serves its build; in dev Vite serves it and proxies here.
  const spaIndex = config.webDist ? serveStatic({ root: config.webDist, rewriteRequestPath: () => "/index.html" }) : null;
  if (spaIndex && config.webDist) {
    app.get("/", spaIndex);
    app.get("/assets/*", serveStatic({ root: config.webDist }));
  }

  if (db) {
    const auth = createAuthService({ db, mailer, appUrl: config.appUrl, registration: config.registration });
    app.route("/", createAuthRoutes(auth, { secureCookies: config.production }));
    app.get("/v1/me", requireSession(auth), (c) => {
      const { id, email, isOwner } = c.var.account;
      return c.json({ id, email, isOwner });
    });
  } else {
    app.get("/sign-in", (c) => c.text("Sign-in needs a database. Set DATABASE_URL and run the migrations.", 503));
    app.get("/v1/me", (c) => c.json({ error: "unauthorized" }, 401));
  }

  // Landing page and waitlist, server-rendered with Hono JSX. In production the landing runs as a Cloudflare Worker (src/worker.ts).
  app.route("/", createLanding(joinWaitlist, { appUrl: config.appUrl }));

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

  // SPA fallback for client-side routes.
  if (spaIndex) app.get("*", spaIndex);

  return app;
}
