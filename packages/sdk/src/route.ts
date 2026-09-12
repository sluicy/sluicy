import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { VISITOR_COOKIE, type SluicyOptions } from "./index.js";

/**
 * Mount on the founder's own domain, e.g. app.use("/sluicy/*", sluicyRoutes(opts)).
 * Serves the collector and Link redirects so the Visitor cookie is first-party and server-set.
 * Scaffold: forwards to the Sluicy API; the redirect map is fetched lazily in a later milestone.
 */
export function sluicyRoutes(opts: SluicyOptions) {
  const base = opts.endpoint ?? "https://app.sluicy.dev";
  const app = new Hono();

  app.post("/collect", async (c) => {
    let vid = getCookie(c, VISITOR_COOKIE);
    if (!vid) {
      vid = crypto.randomUUID();
      setCookie(c, VISITOR_COOKIE, vid, { path: "/", httpOnly: true, sameSite: "Lax", secure: true, maxAge: 60 * 60 * 24 * 400 });
    }
    const body = await c.req.json().catch(() => ({}));
    await fetch(`${base}/v1/collect`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${opts.apiKey}` },
      body: JSON.stringify({ ...body, visitorId: vid }),
    }).catch(() => undefined);
    return c.body(null, 204);
  });

  app.get("/go/:slug", async (c) => {
    const slug = c.req.param("slug");
    const res = await fetch(`${base}/v1/links/${encodeURIComponent(slug)}`, {
      headers: { authorization: `Bearer ${opts.apiKey}` },
    }).catch(() => null);
    if (!res || !res.ok) return c.notFound();
    const { destination } = (await res.json()) as { destination: string };
    return c.redirect(destination, 302);
  });

  return app;
}
