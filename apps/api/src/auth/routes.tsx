import { Hono } from "hono";
import { isEmail, normalizeEmail } from "../ui/email.js";
import { SignInPage, type SignInState } from "./page.js";
import type { AuthService, VerifyError } from "./service.js";
import { clearSessionCookie, sessionIdFrom, setSessionCookie } from "./session.js";

const verifyMessages: Record<VerifyError, string> = {
  invalid: "That link isn't valid. Request a new one.",
  expired: "That link has expired. Request a new one.",
  used: "That link was already used. Request a new one.",
  closed: "Registration is closed on this Sluicy. Ask the owner for an invite.",
};

/** Sign-in pages and session endpoints, served at the app origin (app.{domain}). Sign-in and sign-up are the same flow. */
export function createAuthRoutes(auth: AuthService, { secureCookies }: { secureCookies: boolean }) {
  const routes = new Hono();

  routes.get("/sign-in", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (sessionId && (await auth.accountForSession(sessionId))) return c.redirect("/", 303);

    const error = c.req.query("error") as VerifyError | undefined;
    const state: SignInState = error && error in verifyMessages ? { kind: "error", message: verifyMessages[error] } : { kind: "idle" };
    return c.html(<SignInPage state={state} />);
  });

  routes.post("/sign-in", async (c) => {
    const body = await c.req.parseBody();
    const email = normalizeEmail(body["email"]);
    if (!isEmail(email)) {
      return c.html(<SignInPage state={{ kind: "error", message: "That email doesn't look right. Check it and try again." }} email={email} />, 400);
    }
    try {
      await auth.requestSignIn(email);
    } catch (err) {
      console.error("sign-in mail failed", err);
      return c.html(<SignInPage state={{ kind: "error", message: "Couldn't send the email. Give it a second and try again." }} email={email} />, 503);
    }
    return c.html(<SignInPage state={{ kind: "sent", email }} />);
  });

  routes.get("/sign-in/verify", async (c) => {
    const token = c.req.query("token") ?? "";
    const result = await auth.verify(token);
    if (!result.ok) return c.redirect(`/sign-in?error=${result.error}`, 303);
    setSessionCookie(c, result.sessionId, secureCookies);
    return c.redirect("/", 303);
  });

  routes.post("/sign-out", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (sessionId) await auth.signOut(sessionId);
    clearSessionCookie(c);
    return c.redirect("/sign-in", 303);
  });

  return routes;
}
