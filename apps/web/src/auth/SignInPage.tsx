import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { requestSignIn, type VerifyError } from "./api.js";

const verifyMessages: Record<VerifyError, string> = {
  invalid: "That link isn't valid. Request a new one.",
  expired: "That link has expired. Request a new one.",
  used: "That link was already used. Request a new one.",
  closed: "Registration is closed on this Sluicy. Ask the owner for an invite.",
};

/** Sign-in and sign-up are one flow: the first verified email creates the Account. */
export function SignInPage() {
  const [params] = useSearchParams();
  const linkError = params.get("error") as VerifyError | null;
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string }>(
    linkError && linkError in verifyMessages ? { kind: "error", message: verifyMessages[linkError] } : { kind: "idle" },
  );

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState({ kind: "sending" });
    try {
      await requestSignIn(email.trim().toLowerCase());
      setState({ kind: "sent" });
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  return (
    <main className="auth">
      <Link className="wordmark" to="/">Sluicy</Link>
      <div className="auth-card">
        {state.kind === "sent" ? (
          <>
            <h1>Check your email</h1>
            <div className="auth-done" aria-live="polite">
              If <strong>{email}</strong> can sign in, a link is on its way. It works once and expires in 15 minutes.
            </div>
            <p>
              Wrong address?{" "}
              <button type="button" className="link" onClick={() => setState({ kind: "idle" })}>
                Try another
              </button>
              .
            </p>
          </>
        ) : (
          <>
            <h1>Sign in</h1>
            <p>No password. We email you a link; the first sign-in creates your account.</p>
            <form onSubmit={submit}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                required
                placeholder="you@yourproduct.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn" type="submit" disabled={state.kind === "sending"}>
                {state.kind === "sending" ? "Sending…" : "Email me a sign-in link"}
              </button>
              {state.kind === "error" ? (
                <div className="auth-err" role="alert">
                  {state.message}
                </div>
              ) : null}
            </form>
          </>
        )}
      </div>
    </main>
  );
}
