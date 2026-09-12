import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { normalizeEmail } from "../email.js";
import type { AuthService } from "./service.js";
import { clearSessionCookie, requireSession, sessionIdFrom, setSessionCookie, type SessionEnv } from "./session.js";

const AccountSchema = z
  .object({ id: z.string().uuid(), email: z.string().email(), isOwner: z.boolean() })
  .openapi("Account");

const ErrorSchema = z.object({ error: z.string() }).openapi("Error");

const jsonBody = <T extends z.ZodTypeAny>(schema: T) => ({ content: { "application/json": { schema } }, required: true });
const jsonResponse = <T extends z.ZodTypeAny>(schema: T, description: string) => ({ content: { "application/json": { schema } }, description });

const signIn = createRoute({
  method: "post",
  path: "/sign-in",
  tags: ["auth"],
  summary: "Email a one-time sign-in link",
  description: "Sign-in and sign-up are the same flow: the first verified email creates the Account. Answers 202 for any well-formed email, whether or not a mail went out, so callers cannot learn which emails have Accounts.",
  request: { body: jsonBody(z.object({ email: z.string().email().openapi({ example: "founder@example.com" }) })) },
  responses: {
    202: { description: "Accepted. A link is on its way if the policy allows this email." },
    400: jsonResponse(ErrorSchema, "Malformed email"),
  },
});

const verify = createRoute({
  method: "post",
  path: "/verify",
  tags: ["auth"],
  summary: "Consume a sign-in token and open a session",
  description: "The emailed link lands on the app, which POSTs the token here. A POST, not a GET, so a mail gateway prefetching the link cannot consume the token.",
  request: { body: jsonBody(z.object({ token: z.string() })) },
  responses: {
    200: { ...jsonResponse(AccountSchema, "Signed in. The session cookie is set."), headers: z.object({ "Set-Cookie": z.string() }) },
    400: jsonResponse(z.object({ error: z.enum(["invalid", "expired", "used", "closed"]) }).openapi("VerifyError"), "Token refused"),
  },
});

const signOut = createRoute({
  method: "post",
  path: "/sign-out",
  tags: ["auth"],
  summary: "Revoke the session and clear the cookie",
  responses: { 204: { description: "Signed out" } },
});

const me = createRoute({
  method: "get",
  path: "/me",
  tags: ["auth"],
  summary: "The signed-in Account",
  responses: { 200: jsonResponse(AccountSchema, "Signed in"), 401: jsonResponse(ErrorSchema, "No valid session") },
});

/** JSON auth endpoints for the React app at app.{domain}. Route definitions double as the OpenAPI document. */
export function createAuthRoutes(auth: AuthService, { secureCookies }: { secureCookies: boolean }) {
  const routes = new OpenAPIHono<SessionEnv>({
    defaultHook: (result, c) => (result.success ? undefined : c.json({ error: "invalid_body" }, 400)),
  });

  routes.openapi(signIn, async (c) => {
    await auth.requestSignIn(normalizeEmail(c.req.valid("json").email));
    return c.body(null, 202);
  });

  routes.openapi(verify, async (c) => {
    const result = await auth.verify(c.req.valid("json").token);
    if (!result.ok) return c.json({ error: result.error }, 400);
    setSessionCookie(c, result.sessionId, secureCookies);
    return c.json(publicAccount(result.account), 200);
  });

  routes.openapi(signOut, async (c) => {
    const sessionId = sessionIdFrom(c);
    if (sessionId) await auth.signOut(sessionId);
    clearSessionCookie(c);
    return c.body(null, 204);
  });

  routes.use(me.getRoutingPath(), requireSession(auth));
  routes.openapi(me, (c) => c.json(publicAccount(c.var.account), 200));

  return routes;
}

function publicAccount({ id, email, isOwner }: { id: string; email: string; isOwner: boolean }): z.infer<typeof AccountSchema> {
  return { id, email, isOwner };
}
