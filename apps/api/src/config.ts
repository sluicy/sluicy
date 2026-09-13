// Runtime configuration read once from the environment. Every module takes what it needs from here.
export type Config = ReturnType<typeof readConfig>;

export function readConfig(env: NodeJS.ProcessEnv = process.env) {
  const production = env.NODE_ENV === "production";
  return {
    production,
    /** Where the signed-in app lives, e.g. https://app.sluicy.dev. Magic links and the landing page's "Sign in" point here. */
    appUrl: (env.APP_URL ?? "http://localhost:5173").replace(/\/$/, ""),
    /** "closed" (default, SPEC 10): only existing Accounts and the very first signup can sign in. "open": anyone. */
    registration: env.REGISTRATION === "open" ? ("open" as const) : ("closed" as const),
    /** Built SPA to serve at appUrl in production. Unset in dev, where Vite serves it. */
    webDist: env.WEB_DIST,
    mail: {
      from: env.MAIL_FROM ?? "Sluicy <sign-in@sluicy.dev>",
      smtpUrl: env.SMTP_URL || undefined,
      resendApiKey: env.RESEND_API_KEY || undefined,
    },
  };
}
