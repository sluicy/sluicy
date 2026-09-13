import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { api } from "@/api/client";
import { useAccount } from "@/auth";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";

export function Home() {
  const account = useAccount();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const signOut = api.useMutation("post", "/v1/auth/sign-out", {
    onSuccess: () => {
      queryClient.clear();
      navigate("/sign-in", { replace: true });
    },
  });

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-6 flex items-center justify-between gap-4 border-b pb-4">
        <Wordmark />
        <span className="flex items-center gap-3 text-sm text-muted-foreground">
          {account.email}
          {account.isOwner ? " · owner" : ""}
          <Button variant="outline" size="sm" onClick={() => signOut.mutate({})} disabled={signOut.isPending}>
            Sign out
          </Button>
        </span>
      </header>
      <p>Open-source growth analytics for content-led founders. Find the content that pays. Stop the rest.</p>
      <p className="mt-2 text-muted-foreground">
        Next: the Ledger and the Weekly Page. See <code className="font-mono text-sm">SPEC.md</code>.
      </p>
    </main>
  );
}
