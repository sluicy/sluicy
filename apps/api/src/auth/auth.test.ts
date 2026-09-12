import { sql } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { readConfig } from "../config.js";
import type { Mail } from "./mailer.js";
import { testDb } from "../test/db.js";

/** End-to-end through HTTP: request a link, click it, read /v1/me, sign out. Runs against the real migrated Postgres. */
describe("magic-link sign-in", () => {
  let handle: Awaited<ReturnType<typeof testDb>>;
  const sent: Mail[] = [];
  let app: ReturnType<typeof createApp>;

  const build = (registration: "open" | "closed") =>
    createApp({ config: { ...readConfig({}), registration, appUrl: "http://app.test" }, db: handle.db, mailer: async (m) => void sent.push(m) });

  beforeAll(async () => {
    handle = await testDb();
  });
  afterAll(() => handle.close());
  beforeEach(async () => {
    await handle.reset();
    sent.length = 0;
    app = build("closed");
  });

  const requestLink = (email: string) =>
    app.request("/sign-in", { method: "POST", body: new URLSearchParams({ email }), headers: { "content-type": "application/x-www-form-urlencoded" } });
  const linkFromMail = () => {
    const url = sent.at(-1)?.text.match(/https?:\/\/\S+/)?.[0];
    if (!url) throw new Error("no link in mail");
    return new URL(url);
  };
  const clickLink = (url: URL) => app.request(url.pathname + url.search);
  const cookieFrom = (res: Response) => res.headers.get("set-cookie")?.split(";")[0] ?? "";

  it("first sign-in on an empty instance creates the owner Account and a session cookie", async () => {
    const res = await requestLink("founder@example.com");
    expect(res.status).toBe(200);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.to).toBe("founder@example.com");

    const link = linkFromMail();
    expect(link.origin).toBe("http://app.test");
    const verified = await clickLink(link);
    expect(verified.status).toBe(303);
    expect(verified.headers.get("location")).toBe("/");
    const cookie = cookieFrom(verified);
    expect(cookie).toMatch(/^sluicy_session=/);
    expect(verified.headers.get("set-cookie")).toContain("HttpOnly");

    const me = await app.request("/v1/me", { headers: { cookie } });
    expect(me.status).toBe(200);
    expect(await me.json()).toMatchObject({ email: "founder@example.com", isOwner: true });
  });

  it("with registration closed, an unknown email gets the same page but no mail and no Account", async () => {
    await requestLink("founder@example.com");
    await clickLink(linkFromMail());
    sent.length = 0;

    const res = await requestLink("stranger@example.com");
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("Check your email");
    expect(sent).toHaveLength(0);
  });

  it("with registration open, a second email becomes a member, not an owner", async () => {
    app = build("open");
    await requestLink("founder@example.com");
    await clickLink(linkFromMail());
    await requestLink("second@example.com");
    const cookie = cookieFrom(await clickLink(linkFromMail()));
    const me = await app.request("/v1/me", { headers: { cookie } });
    expect(await me.json()).toMatchObject({ email: "second@example.com", isOwner: false });
  });

  it("a link works once; the second click is refused as used", async () => {
    await requestLink("founder@example.com");
    const link = linkFromMail();
    await clickLink(link);
    const again = await clickLink(link);
    expect(again.status).toBe(303);
    expect(again.headers.get("location")).toBe("/sign-in?error=used");
  });

  it("an expired link is refused", async () => {
    await requestLink("founder@example.com");
    const link = linkFromMail();
    await handle.db.execute(sql`update magic_links set expires_at = now() - interval '1 minute'`);
    const res = await clickLink(link);
    expect(res.headers.get("location")).toBe("/sign-in?error=expired");
  });

  it("a tampered token is invalid", async () => {
    const res = await app.request("/sign-in/verify?token=not-a-real-token");
    expect(res.headers.get("location")).toBe("/sign-in?error=invalid");
  });

  it("sign-out revokes the session so the cookie stops working", async () => {
    await requestLink("founder@example.com");
    const cookie = cookieFrom(await clickLink(linkFromMail()));
    const out = await app.request("/sign-out", { method: "POST", headers: { cookie } });
    expect(out.headers.get("location")).toBe("/sign-in");
    const me = await app.request("/v1/me", { headers: { cookie } });
    expect(me.status).toBe(401);
  });

  it("a signed-in visitor to /sign-in is sent to the app", async () => {
    await requestLink("founder@example.com");
    const cookie = cookieFrom(await clickLink(linkFromMail()));
    const res = await app.request("/sign-in", { headers: { cookie } });
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/");
  });
});
