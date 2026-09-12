import type { FC } from "hono/jsx";
import { baseCss } from "../ui/styles.js";

export type SignInState =
  | { kind: "idle" }
  | { kind: "sent"; email: string }
  | { kind: "error"; message: string };

const css = baseCss + `
.auth{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;gap:28px}
.auth-card{width:100%;max-width:440px;padding:32px;display:flex;flex-direction:column;gap:18px}
.auth h1{margin:0;font-size:28px;font-weight:800}
.auth p{margin:0;color:var(--muted);font-size:15px}
.auth form{display:flex;flex-direction:column;gap:10px}
.auth label{font-size:13px;color:var(--dim)}
.auth input{height:48px;border-radius:10px;border:1px solid var(--line-2);background:var(--bg);color:var(--ink);padding:0 16px;font:inherit;font-size:15px}
.auth input:focus-visible,.btn:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.auth .btn{height:48px;border-radius:10px}
.auth-err{color:var(--stop);font-size:14px}
.auth-done{border:1px solid var(--accent);border-radius:12px;padding:14px 18px;font-size:15px}
.wordmark{display:flex;align-items:center;gap:10px;font-weight:800;font-size:22px}
`;

export const SignInPage: FC<{ state: SignInState; email?: string }> = ({ state, email }) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Sign in · Sluicy</title>
      <meta name="robots" content="noindex" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Manrope:wght@400;500;700&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </head>
    <body>
      <main class="auth">
        <a class="wordmark display" href="/">Sluicy</a>
        <div class="panel auth-card">
          {state.kind === "sent" ? (
            <>
              <h1 class="display">Check your email</h1>
              <div class="auth-done" aria-live="polite">
                If <strong>{state.email}</strong> can sign in, a link is on its way. It works once and expires in 15 minutes.
              </div>
              <p>
                Wrong address? <a href="/sign-in" style="color:var(--accent)">Try another</a>.
              </p>
            </>
          ) : (
            <>
              <h1 class="display">Sign in</h1>
              <p>No password. We email you a link; the first sign-in creates your account.</p>
              <form method="post" action="/sign-in">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" placeholder="you@yourproduct.com" autocomplete="email" autofocus required value={email ?? ""} />
                <button class="btn btn-accent" type="submit">Email me a sign-in link</button>
                {state.kind === "error" ? <div class="auth-err" role="alert">{state.message}</div> : null}
              </form>
            </>
          )}
        </div>
      </main>
    </body>
  </html>
);
