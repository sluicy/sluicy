import { sql } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { readConfig } from "../config.js";
import type { Mail } from "./mailer.js";
import { testDb } from "../test/db.js";

/** Through HTTP, the way the React app calls it: request a link, verify its token, read /me, sign out. Real migrated Postgres. */
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

  const json = (path: string, body: unknown, headers: Record<string, string> = {}) =>
    app.request(path, { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json", ...headers } });
  const requestLink = (email: string) => json("/v1/auth/sign-in", { email });
  const tokenFromMail = () => {
    const url = sent.at(-1)?.text.match(/https?:\/\/\S+/)?.[0];
    if (!url) throw new Error("no link in mail");
    const link = new URL(url);
    expect(link.origin + link.pathname).toBe("http://app.test/sign-in/verify");
    return link.searchParams.get("token") ?? "";
  };
  const verify = (token: string) => json("/v1/auth/verify", { token });
  const cookieFrom = (res: Response) => res.headers.get("set-cookie")?.split(";")[0] ?? "";
  const signInAs = async (email: string) => {
    await requestLink(email);
    return cookieFrom(await verify(tokenFromMail()));
  };

  it("first sign-in on an empty instance creates the owner Account and a session cookie", async () => {
    const res = await requestLink("founder@example.com");
    expect(res.status).toBe(202);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.to).toBe("founder@example.com");

    const verified = await verify(tokenFromMail());
    expect(verified.status).toBe(200);
    expect(await verified.json()).toMatchObject({ email: "founder@example.com", isOwner: true });
    const setCookie = verified.headers.get("set-cookie") ?? "";
    expect(setCookie).toMatch(/^sluicy_session=/);
    expect(setCookie).toContain("HttpOnly");

    const me = await app.request("/v1/auth/me", { headers: { cookie: cookieFrom(verified) } });
    expect(me.status).toBe(200);
    expect(await me.json()).toMatchObject({ email: "founder@example.com", isOwner: true });
  });

  it("rejects a malformed email with 400 and sends nothing", async () => {
    const res = await requestLink("not-an-email");
    expect(res.status).toBe(400);
    expect(sent).toHaveLength(0);
  });

  it("with registration closed, an unknown email gets the same 202 but no mail and no Account", async () => {
    await signInAs("founder@example.com");
    sent.length = 0;
    const res = await requestLink("stranger@example.com");
    expect(res.status).toBe(202);
    expect(sent).toHaveLength(0);
  });

  it("with registration open, a second email becomes a member, not an owner", async () => {
    app = build("open");
    await signInAs("founder@example.com");
    const cookie = await signInAs("second@example.com");
    const me = await app.request("/v1/auth/me", { headers: { cookie } });
    expect(await me.json()).toMatchObject({ email: "second@example.com", isOwner: false });
  });

  it("a token works once; the second use is refused as used", async () => {
    await requestLink("founder@example.com");
    const token = tokenFromMail();
    await verify(token);
    const again = await verify(token);
    expect(again.status).toBe(400);
    expect(await again.json()).toEqual({ error: "used" });
  });

  it("an expired token is refused", async () => {
    await requestLink("founder@example.com");
    const token = tokenFromMail();
    await handle.db.execute(sql`update magic_links set expires_at = now() - interval '1 minute'`);
    const res = await verify(token);
    expect(await res.json()).toEqual({ error: "expired" });
  });

  it("a tampered token is invalid", async () => {
    const res = await verify("not-a-real-token");
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid" });
  });

  it("sign-out revokes the session so the cookie stops working", async () => {
    const cookie = await signInAs("founder@example.com");
    const out = await app.request("/v1/auth/sign-out", { method: "POST", headers: { cookie } });
    expect(out.status).toBe(204);
    const me = await app.request("/v1/auth/me", { headers: { cookie } });
    expect(me.status).toBe(401);
  });

  it("/me without a cookie is 401", async () => {
    const me = await app.request("/v1/auth/me");
    expect(me.status).toBe(401);
  });
});
