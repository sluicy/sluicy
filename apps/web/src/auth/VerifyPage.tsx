import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { api } from "@/api/client";
import { Spinner } from "@/components/ui/spinner";

/** Landing spot for the emailed link. Consumes the token with a POST, then hands over to the app or back to sign-in. */
export function VerifyPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const verify = api.useMutation("post", "/v1/auth/verify", {
    onSuccess: (account) => {
      queryClient.setQueryData(api.queryOptions("get", "/v1/auth/me").queryKey, account);
      navigate("/", { replace: true });
    },
    onError: (err) => navigate(`/sign-in?error=${err.error}`, { replace: true }),
  });

  const token = params.get("token") ?? "";
  useEffect(() => {
    verify.mutate({ body: { token } });
    // Runs once per token; the mutation object changes identity every render and must not retrigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <p className="flex items-center gap-2 text-muted-foreground" aria-live="polite">
        <Spinner /> Signing you in…
      </p>
    </main>
  );
}
