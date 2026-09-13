import { and, count, eq, isNull } from "drizzle-orm";
import { accounts, magicLinks, sessions, type Db } from "@sluicy/db";
import type { Mailer } from "./mailer.js";
import { signInDecision, type Registration } from "./policy.js";
import { hashSecret, newSecret } from "./tokens.js";

export type Account = typeof accounts.$inferSelect;
export type VerifyError = "invalid" | "expired" | "used" | "closed";

const LINK_TTL_MS = 15 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type AuthService = ReturnType<typeof createAuthService>;

export function createAuthService(deps: { db: Db; mailer: Mailer; appUrl: string; registration: Registration; now?: () => Date }) {
  const { db, mailer, appUrl, registration } = deps;
  const now = deps.now ?? (() => new Date());

  async function decide(email: string) {
    const [existing] = await db.select({ id: accounts.id }).from(accounts).where(eq(accounts.email, email)).limit(1);
    const [total] = await db.select({ n: count() }).from(accounts);
    return signInDecision({ accountExists: !!existing, instanceHasAccounts: (total?.n ?? 0) > 0, registration });
  }

  return {
    /** Emails a one-time link when the policy allows it. Silent otherwise, so the form never reveals which emails have Accounts. */
    async requestSignIn(email: string): Promise<void> {
      if ((await decide(email)) === null) return;
      const token = newSecret();
      await db.insert(magicLinks).values({ tokenHash: hashSecret(token), email, expiresAt: new Date(now().getTime() + LINK_TTL_MS) });
      const link = `${appUrl}/sign-in/verify?token=${token}`;
      await mailer({
        to: email,
        subject: "Sign in to Sluicy",
        text: `Open this link to sign in. It works once and expires in 15 minutes.\n\n${link}\n\nIf you didn't ask for it, ignore this email.`,
      });
    },

    /** Consumes the link, creates the Account on first sign-in, and opens a session. Returns the raw session id for the cookie. */
    async verify(token: string): Promise<{ ok: true; sessionId: string; account: Account } | { ok: false; error: VerifyError }> {
      const tokenHash = hashSecret(token);
      const [link] = await db.select().from(magicLinks).where(eq(magicLinks.tokenHash, tokenHash)).limit(1);
      if (!link) return { ok: false, error: "invalid" };
      if (link.consumedAt) return { ok: false, error: "used" };
      if (link.expiresAt.getTime() <= now().getTime()) return { ok: false, error: "expired" };

      // Consume atomically: a concurrent second click sees zero rows and fails as "used".
      const consumed = await db
        .update(magicLinks)
        .set({ consumedAt: now() })
        .where(and(eq(magicLinks.tokenHash, tokenHash), isNull(magicLinks.consumedAt)))
        .returning({ email: magicLinks.email });
      if (consumed.length === 0) return { ok: false, error: "used" };

      const account = await findOrCreateAccount(link.email);
      if (!account) return { ok: false, error: "closed" };

      const sessionId = newSecret();
      await db.insert(sessions).values({ idHash: hashSecret(sessionId), accountId: account.id, expiresAt: new Date(now().getTime() + SESSION_TTL_MS) });
      return { ok: true, sessionId, account };
    },

    async accountForSession(sessionId: string): Promise<Account | null> {
      const [row] = await db
        .select({ account: accounts, expiresAt: sessions.expiresAt })
        .from(sessions)
        .innerJoin(accounts, eq(accounts.id, sessions.accountId))
        .where(eq(sessions.idHash, hashSecret(sessionId)))
        .limit(1);
      if (!row || row.expiresAt.getTime() <= now().getTime()) return null;
      return row.account;
    },

    async signOut(sessionId: string): Promise<void> {
      await db.delete(sessions).where(eq(sessions.idHash, hashSecret(sessionId)));
    },
  };

  async function findOrCreateAccount(email: string): Promise<Account | null> {
    const decision = await decide(email);
    if (decision === null) return null;
    if (decision === "existing") {
      const [account] = await db.select().from(accounts).where(eq(accounts.email, email)).limit(1);
      return account ?? null;
    }
    const [created] = await db
      .insert(accounts)
      .values({ email, isOwner: decision === "owner" })
      .onConflictDoNothing({ target: accounts.email })
      .returning();
    if (created) return created;
    // Lost a race with another sign-in for the same email; the row exists now.
    const [account] = await db.select().from(accounts).where(eq(accounts.email, email)).limit(1);
    return account ?? null;
  }
}
