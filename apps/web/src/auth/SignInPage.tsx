import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { api, type VerifyError } from "../api/client.js";

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
  const signIn = api.useMutation("post", "/v1/auth/sign-in");

  function submit(e: FormEvent) {
    e.preventDefault();
    signIn.mutate({ body: { email: email.trim().toLowerCase() } });
  }

  const error = signIn.isError
    ? "That email doesn't look right, or the mail couldn't be sent. Check it and try again."
    : linkError && linkError in verifyMessages && signIn.isIdle
      ? verifyMessages[linkError]
      : null;

  return (
    <main className="auth">
      <Link className="wordmark" to="/">Sluicy</Link>
      <div className="auth-card">
        {signIn.isSuccess ? (
          <>
            <h1>Check your email</h1>
            <div className="auth-done" aria-live="polite">
              If <strong>{email}</strong> can sign in, a link is on its way. It works once and expires in 15 minutes.
            </div>
            <p>
              Wrong address?{" "}
              <button type="button" className="link" onClick={() => signIn.reset()}>
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
              <button className="btn" type="submit" disabled={signIn.isPending}>
                {signIn.isPending ? "Sending…" : "Email me a sign-in link"}
              </button>
              {error ? (
                <div className="auth-err" role="alert">
                  {error}
                </div>
              ) : null}
            </form>
          </>
        )}
      </div>
    </main>
  );
}
