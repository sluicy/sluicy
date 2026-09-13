import type { Context, MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { Account, AuthService } from "./service.js";

export const SESSION_COOKIE = "sluicy_session";
const SESSION_COOKIE_MAX_AGE_S = 30 * 24 * 60 * 60;

export type SessionEnv = { Variables: { account: Account } };

export function setSessionCookie(c: Context, sessionId: string, secure: boolean) {
  setCookie(c, SESSION_COOKIE, sessionId, { httpOnly: true, secure, sameSite: "Lax", path: "/", maxAge: SESSION_COOKIE_MAX_AGE_S });
}

export function clearSessionCookie(c: Context) {
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
}

export function sessionIdFrom(c: Context): string | undefined {
  return getCookie(c, SESSION_COOKIE);
}

/** Resolves the cookie to an Account on `c.var.account`, or answers 401. For JSON routes; pages redirect instead. */
export function requireSession(auth: AuthService): MiddlewareHandler<SessionEnv> {
  return async (c, next) => {
    const sessionId = sessionIdFrom(c);
    const account = sessionId ? await auth.accountForSession(sessionId) : null;
    if (!account) return c.json({ error: "unauthorized" }, 401);
    c.set("account", account);
    await next();
  };
}
