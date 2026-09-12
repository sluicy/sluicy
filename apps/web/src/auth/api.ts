export type Account = { id: string; email: string; isOwner: boolean };
export type VerifyError = "invalid" | "expired" | "used" | "closed";

async function post(path: string, body?: unknown): Promise<Response> {
  return fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: body === undefined ? null : JSON.stringify(body) });
}

/** Resolves once the request is accepted. Whether a mail went out is deliberately not revealed. */
export async function requestSignIn(email: string): Promise<void> {
  const res = await post("/v1/auth/sign-in", { email });
  if (res.status === 400) throw new Error("That email doesn't look right. Check it and try again.");
  if (res.status === 503) throw new Error("Sign-in isn't connected to a database yet.");
  if (!res.ok) throw new Error("Couldn't send the email. Give it a second and try again.");
}

export async function verifySignIn(token: string): Promise<{ ok: true; account: Account } | { ok: false; error: VerifyError }> {
  const res = await post("/v1/auth/verify", { token });
  if (res.ok) return { ok: true, account: (await res.json()) as Account };
  const { error } = (await res.json().catch(() => ({ error: "invalid" }))) as { error: VerifyError };
  return { ok: false, error };
}

export async function signOut(): Promise<void> {
  await post("/v1/auth/sign-out");
}

/** The signed-in Account, or null when the cookie is missing or stale. */
export async function fetchMe(): Promise<Account | null> {
  const res = await fetch("/v1/auth/me");
  return res.ok ? ((await res.json()) as Account) : null;
}
