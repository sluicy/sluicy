import { useEffect, useState } from "react";

type Me = { id: string; email: string; isOwner: boolean };

export function App() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);

  useEffect(() => {
    fetch("/v1/me")
      .then(async (r) => (r.ok ? setMe((await r.json()) as Me) : setMe(null)))
      .catch(() => setMe(null));
  }, []);

  // Signed-out: hand over to the server-rendered sign-in page at the same origin.
  useEffect(() => {
    if (me === null) window.location.assign("/sign-in");
  }, [me]);

  if (!me) return null;

  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: 640 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <h1 style={{ margin: 0 }}>Sluicy</h1>
        <form method="post" action="/sign-out" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span>
            {me.email}
            {me.isOwner ? " · owner" : ""}
          </span>
          <button type="submit">Sign out</button>
        </form>
      </header>
      <p>Open-source growth analytics for content-led founders. Find the content that pays. Stop the rest.</p>
      <p>
        Next: the Ledger and the Weekly Page. See <code>SPEC.md</code>.
      </p>
    </main>
  );
}
