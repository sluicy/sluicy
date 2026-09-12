import { useEffect, useState } from "react";

export function App() {
  const [api, setApi] = useState<"checking" | "up" | "down">("checking");

  useEffect(() => {
    fetch("/health")
      .then((r) => (r.ok ? setApi("up") : setApi("down")))
      .catch(() => setApi("down"));
  }, []);

  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: 640 }}>
      <h1>Sluicy</h1>
      <p>Open-source growth analytics for content-led founders. Find the content that pays. Stop the rest.</p>
      <p>
        API: <strong>{api}</strong>
      </p>
      <p>
        Next: the Ledger and the Weekly Page. See <code>SPEC.md</code>.
      </p>
    </main>
  );
}
