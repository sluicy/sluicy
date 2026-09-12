import { Hono } from "hono";
import { isEmail, normalizeEmail } from "../email.js";
import type { AuthService } from "./service.js";
import { clearSessionCookie, requireSession, sessionIdFrom, setSessionCookie, type SessionEnv } from "./session.js";

/** JSON auth endpoints for the React app at app.{domain}. Sign-in and sign-up are the same flow. */
export function createAuthRoutes(auth: AuthService, { secureCookies }: { secureCookies: boolean }) {
  const routes = new Hono<SessionEnv>();

  // Always 202 for a well-formed email, whether or not a mail went out, so the form never reveals which emails have Accounts.
  routes.post("/sign-in", async (c) => {
    const email = normalizeEmail((await jsonBody(c.req.raw)).email);
    if (!isEmail(email)) return c.json({ error: "invalid_email" }, 400);
    await auth.requestSignIn(email);
    return c.body(null, 202);
  });

  // POST, not GET: mail gateways prefetch links, and a prefetch must not consume the one-time token.
  routes.post("/verify", async (c) => {
    const result = await auth.verify(String((await jsonBody(c.req.raw)).token ?? ""));
    if (!result.ok) return c.json({ error: result.error }, 400);
    setSessionCookie(c, result.sessionId, secureCookies);
    return c.json(publicAccount(result.account));
  });

  routes.post("/sign-out", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (sessionId) await auth.signOut(sessionId);
    clearSessionCookie(c);
    return c.body(null, 204);
  });

  routes.get("/me", requireSession(auth), (c) => c.json(publicAccount(c.var.account)));

  return routes;
}

async function jsonBody(req: Request): Promise<Record<string, unknown>> {
  const body: unknown = await req.json().catch(() => null);
  return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
}

function publicAccount({ id, email, isOwner }: { id: string; email: string; isOwner: boolean }) {
  return { id, email, isOwner };
}
