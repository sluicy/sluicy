import { Hono } from "hono";
import { LandingPage, type WaitlistState } from "./page.js";
import { joinWaitlist } from "./waitlist.js";

export const landing = new Hono();

landing.get("/", (c) => {
  const state: WaitlistState = c.req.query("joined") === "1" ? { kind: "joined" } : { kind: "idle" };
  return c.html(<LandingPage state={state} />);
});

landing.post("/waitlist", async (c) => {
  const body = await c.req.parseBody();
  const email = String(body["email"] ?? "").trim().toLowerCase();
  const form = String(body["form"] ?? "");
  const referrer = c.req.header("referer") ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return c.html(<LandingPage state={{ kind: "error", message: "That email doesn't look right. Check it and try again." }} email={email} />, 400);
  }

  const result = await joinWaitlist({ email, form, referrer });
  if (!result.ok) {
    return c.html(<LandingPage state={{ kind: "error", message: result.message }} email={email} />, 503);
  }
  return c.redirect("/?joined=1", 303);
});
