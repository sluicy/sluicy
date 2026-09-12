// Public SDK surface. Three parts, per SPEC 8.1:
//  1. the browser snippet (packages/sdk/src/snippet.ts, built separately, under 5 KB)
//  2. a server route handler the founder mounts on their own domain (collector + Link redirects,
//     sets the Visitor cookie server-side so it survives Safari's 7-day cap, ADR 0001)
//  3. the Signup call that binds a Visitor to a User

export const VISITOR_COOKIE = "sl_vid";

export interface SluicyOptions {
  /** Product API key from the Sluicy dashboard. */
  apiKey: string;
  /** Sluicy API base, e.g. https://app.sluicy.dev or your self-hosted instance. */
  endpoint?: string;
}

export interface SignupInput {
  /** The Product's own user id. */
  userId: string;
  email?: string;
  /** Visitor id read from the request cookie. */
  visitorId: string;
}

/** Bind a Visitor to a User. Call from your backend at signup. */
export async function signup(opts: SluicyOptions, input: SignupInput): Promise<void> {
  const base = opts.endpoint ?? "https://app.sluicy.dev";
  const res = await fetch(`${base}/v1/signup`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${opts.apiKey}` },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`sluicy signup failed: ${res.status}`);
}

export { sluicyRoutes } from "./route.js";
