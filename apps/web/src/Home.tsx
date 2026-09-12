import { signOut, useAccount } from "./auth/index.js";

export function Home() {
  const account = useAccount();

  async function onSignOut() {
    await signOut();
    window.location.assign("/sign-in");
  }

  return (
    <main className="page">
      <header className="topbar">
        <span className="wordmark">Sluicy</span>
        <span className="who">
          {account.email}
          {account.isOwner ? " · owner" : ""}
          <button type="button" className="link" onClick={onSignOut}>
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
