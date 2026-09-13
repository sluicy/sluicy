// Cloudflare Worker entry: landing page + waitlist only, for the pre-launch period.
// The full API (collector, webhooks, MCP) runs on Node via src/index.ts; see README "Hosting".
import { Hono } from "hono";
import { createLanding } from "./landing/routes.js";

type Env = { DB: D1Database; APP_URL: string };

const app = new Hono<{ Bindings: Env }>();

app.get("/health", (c) => c.json({ ok: true, service: "sluicy-landing" }));

app.all("/*", async (c, next) => {
  const landing = createLanding(async ({ email, form, referrer }) => {
    try {
      await c.env.DB.prepare("insert or ignore into waitlist (email, form, referrer, created_at) values (?1, ?2, ?3, ?4)")
        .bind(email, form, referrer, new Date().toISOString())
        .run();
      return { ok: true };
    } catch (err) {
      console.error("waitlist insert failed", err);
      return { ok: false, message: "Couldn't save your spot. Give it a second and try again." };
    }
  }, { appUrl: c.env.APP_URL });
  const res = await landing.fetch(c.req.raw, c.env, c.executionCtx);
  if (res.status === 404) return next();
  return res;
});

export default app;
