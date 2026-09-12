import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { api } from "./api/client.js";
import { useAccount } from "./auth/index.js";

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
    <main className="page">
      <header className="topbar">
        <span className="wordmark">Sluicy</span>
        <span className="who">
          {account.email}
          {account.isOwner ? " · owner" : ""}
          <button type="button" className="link" onClick={() => signOut.mutate({})} disabled={signOut.isPending}>
            Sign out
          </button>
        </span>
      </header>
      <p>Open-source growth analytics for content-led founders. Find the content that pays. Stop the rest.</p>
      <p>
        Next: the Ledger and the Weekly Page. See <code>SPEC.md</code>.
      </p>
    </main>
  );
}
