import { Hono } from "hono";
import { LandingPage, type WaitlistState } from "./page.js";
import { isEmail, normalizeEmail } from "../email.js";

export type JoinWaitlist = (input: { email: string; form: string; referrer: string }) => Promise<{ ok: true } | { ok: false; message: string }>;

export type LandingOptions = {
  /** Origin of the signed-in app (app.{domain}); the nav's "Sign in" points at it. */
  appUrl: string;
};

/** Landing page and waitlist routes. The writer is injected so the same page runs on Node (Postgres) and on Cloudflare Workers (D1). */
export function createLanding(joinWaitlist: JoinWaitlist, { appUrl }: LandingOptions) {
const landing = new Hono();

landing.get("/", (c) => {
  const state: WaitlistState = c.req.query("joined") === "1" ? { kind: "joined" } : { kind: "idle" };
  return c.html(<LandingPage state={state} appUrl={appUrl} />);
});

landing.post("/waitlist", async (c) => {
  const body = await c.req.parseBody();
  const email = normalizeEmail(body["email"]);
  const form = String(body["form"] ?? "");
  const referrer = c.req.header("referer") ?? "";

  if (!isEmail(email)) {
    return c.html(<LandingPage state={{ kind: "error", message: "That email doesn't look right. Check it and try again." }} email={email} appUrl={appUrl} />, 400);
  }

  const result = await joinWaitlist({ email, form, referrer });
  if (!result.ok) {
    return c.html(<LandingPage state={{ kind: "error", message: result.message }} email={email} appUrl={appUrl} />, 503);
  }
  return c.redirect("/?joined=1", 303);
});

return landing;
}
