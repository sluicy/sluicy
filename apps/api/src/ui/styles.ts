// Shared design tokens and primitives for every server-rendered page (landing, sign-in). Cool near-black, electric blue.
export const baseCss = `
:root{--bg:#0A0D12;--panel:#12161E;--line:#232A36;--line-2:#2F3947;--ink:#EEF2F7;--muted:#A3ADBD;--dim:#7D8797;--accent:#4D8DFF;--on-accent:#061029;--stop:#F0705A}
*{box-sizing:border-box}
html{color-scheme:dark}
body{margin:0;background:var(--bg);color:var(--ink);font-family:"Manrope","Helvetica Neue",Arial,sans-serif;font-size:17px;line-height:1.5;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.display{font-family:"Syne","Arial Black",Arial,sans-serif;letter-spacing:-.02em}
.mono{font-family:"JetBrains Mono",Menlo,Consolas,monospace;font-variant-numeric:tabular-nums}
.label{font-family:"JetBrains Mono",Menlo,monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
.btn{display:inline-flex;align-items:center;justify-content:center;height:52px;padding:0 24px;border-radius:999px;font-weight:700;font-size:15px;white-space:nowrap;border:0;cursor:pointer;font-family:inherit}
.btn-accent{background:var(--accent);color:var(--on-accent)}
.btn-accent:hover{background:#6AA0FF}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:16px}
.ui{background:var(--bg);border:1px solid var(--line);border-radius:10px}
.chip{display:inline-flex;align-items:center;gap:8px;height:26px;padding:0 10px;border-radius:999px;font-family:"JetBrains Mono",Menlo,monospace;font-size:11.5px}
.chip-line{border:1px solid var(--line-2);color:var(--muted)}
.chip-fill{background:var(--line);color:var(--muted)}
.chip-accent{background:var(--accent);color:var(--on-accent)}
`;
