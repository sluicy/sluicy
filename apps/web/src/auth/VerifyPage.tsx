import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { verifySignIn } from "./api.js";

/** Landing spot for the emailed link. Consumes the token with a POST, then hands over to the app or back to sign-in. */
export function VerifyPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    verifySignIn(params.get("token") ?? "").then((result) => {
      if (cancelled) return;
      navigate(result.ok ? "/" : `/sign-in?error=${result.error}`, { replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [params, navigate]);

  return (
    <main className="auth">
      <p aria-live="polite">Signing you in…</p>
    </main>
  );
}
