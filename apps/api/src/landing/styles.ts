// Landing page styles. Tokens follow the approved design (cool near-black, electric blue).
export const landingCss = `
:root{--bg:#0A0D12;--band:#0E121A;--panel:#12161E;--line:#232A36;--line-2:#2F3947;--ink:#EEF2F7;--muted:#A3ADBD;--dim:#7D8797;--accent:#4D8DFF;--on-accent:#061029;--stop:#F0705A;--reddit:#FF6A2B;--x:#EEF2F7;--substack:#FF8A3D;--linkedin:#4E9BE0;--youtube:#FF4E4E}
*{box-sizing:border-box}
html{color-scheme:dark;scroll-padding-top:24px}
@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
body{margin:0;background:var(--bg);color:var(--ink);font-family:"Geist","Inter","Helvetica Neue",Arial,sans-serif;font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased}
::selection{background:var(--accent);color:var(--on-accent)}
a{color:inherit;text-decoration:none}
.display{font-family:"Geist","Inter","Helvetica Neue",Arial,sans-serif;letter-spacing:-.04em;font-weight:700}
.mono{font-family:"JetBrains Mono",Menlo,Consolas,monospace;font-variant-numeric:tabular-nums}
.wrap{max-width:1160px;margin:0 auto;padding-inline:24px}
.btn{display:inline-flex;align-items:center;justify-content:center;height:48px;padding:0 22px;border-radius:999px;font-weight:700;font-size:15px;white-space:nowrap;border:0;cursor:pointer;font-family:inherit}
.btn-sm{height:38px;padding:0 16px;font-size:14px}
.btn-accent{background:var(--accent);color:var(--on-accent)}
.btn-accent:hover{background:#6AA0FF}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:16px}
.ui{background:var(--bg);border:1px solid var(--line);border-radius:10px}
.page{position:relative;overflow:hidden}
.noise{position:absolute;inset:0;opacity:.06;pointer-events:none;background-image:radial-gradient(#fff .6px,transparent .6px);background-size:3px 3px}
.glow{position:absolute;left:50%;top:-320px;width:1000px;max-width:100vw;height:640px;transform:translateX(-50%);background:radial-gradient(ellipse at center,rgba(77,141,255,.2) 0%,rgba(77,141,255,0) 60%);pointer-events:none}
.nav{position:relative;display:flex;align-items:center;justify-content:space-between;height:76px;gap:16px}
.wordmark{display:flex;align-items:center;gap:8px;font-weight:700;font-size:20px;letter-spacing:-.02em}
.nav-links{display:flex;align-items:center;gap:26px;font-size:14px;color:var(--muted);font-weight:500}
.nav-links a{white-space:nowrap}
.nav-links a:hover{color:var(--ink)}
.hero{position:relative;padding:80px 0 72px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:20px}
.hero h1{margin:0;font-size:clamp(52px,7.2vw,104px);line-height:.96;max-width:1100px;text-wrap:balance}
.hero p{margin:0;font-size:20px;color:var(--muted);max-width:600px;text-wrap:balance}
.wl{display:flex;flex-direction:column;align-items:center;gap:10px;width:100%;max-width:480px;margin-top:6px}
.wl-row{display:flex;gap:8px;width:100%}
.wl input{flex:1;min-width:0;height:48px;border-radius:999px;border:1px solid var(--line-2);background:var(--panel);color:var(--ink);padding:0 18px;font:inherit;font-size:15px;caret-color:var(--accent)}
.wl input::placeholder{color:#6B7585}
.wl input:focus-visible,.btn:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.wl small{font-size:13px;color:var(--dim)}
.wl-done{border:1px solid var(--accent);border-radius:12px;padding:14px 18px;color:var(--ink);font-size:15px;max-width:480px}
.wl-err{color:var(--stop);font-size:14px}
.band{position:relative;background:var(--band);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.section-title{display:flex;align-items:baseline;gap:14px;margin:0 0 28px;font-size:15px;font-weight:600;color:var(--ink)}
.section-title span{color:var(--dim);font-weight:400}
.sluice{position:relative;padding:56px 0 64px}
.sluice-panel{padding:28px;box-shadow:0 30px 80px -40px rgba(0,0,0,.9)}
.sluice-panel .post,.sluice-panel .flow li,.sluice-panel .person{background:var(--band)}
.sluice-grid{display:grid;grid-template-columns:290px 36px minmax(0,1fr) 36px 290px;align-items:center}
.arrow{display:flex;justify-content:center;color:var(--dim)}
.col{display:flex;flex-direction:column;gap:10px;min-width:0}
.col-label{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--dim);margin-bottom:2px}
.col-label.accent{color:var(--accent)}
.posts{display:flex;flex-direction:column;gap:8px}
.post{padding:10px 12px;border-radius:10px;background:var(--bg);border:1px solid var(--line);display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--muted)}
.post-paid{border-color:rgba(77,141,255,.55);box-shadow:0 6px 18px -10px rgba(77,141,255,.6)}
.post-head{display:flex;align-items:center;gap:6px;color:var(--ink)}
.post-head b{font-weight:600}
.post-head span{color:var(--dim);font-size:11px}
.post-head svg{color:var(--dim)}
.post p{margin:0;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.post-meta{font-family:"JetBrains Mono",Menlo,monospace;font-size:10.5px;color:var(--dim)}
.box{position:relative;border:2px solid var(--accent);border-radius:14px;padding:26px 20px 18px;display:flex;flex-direction:column;gap:14px;background:linear-gradient(180deg,rgba(77,141,255,.10),rgba(77,141,255,0))}
.box-tag{position:absolute;top:-14px;left:16px;background:var(--band);padding:0 8px;display:flex;align-items:center;gap:6px;font-weight:700;font-size:15px;letter-spacing:-.02em}
.box-tag svg{width:20px;height:20px}
.flow{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.flow li{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:var(--bg);border:1px solid var(--line);font-size:13px}
.flow li svg{color:var(--accent);flex:none}
.riffles{display:flex}
.riffles i{flex:1;height:8px;border-radius:4px;background:repeating-linear-gradient(90deg,var(--accent) 0 14px,transparent 14px 22px)}
.people{display:flex;flex-direction:column;gap:6px}
.person{display:grid;grid-template-columns:28px minmax(0,1fr) 16px auto;align-items:center;gap:10px;padding:6px 10px 6px 6px;border-radius:999px;background:var(--bg);border:1px solid var(--line);font-size:13px}
.avatar{width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:700;color:var(--ink);background:var(--line);border:2px solid var(--line-2)}
.avatar[data-from=reddit]{border-color:var(--reddit)}
.avatar[data-from=x]{border-color:var(--x)}
.avatar[data-from=substack]{border-color:var(--substack)}
.person-name{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.person-from{color:var(--dim);display:flex}
.person-amt{font-size:12px;color:var(--accent)}
.nobody{display:flex;align-items:center;gap:10px;margin-top:6px;padding:8px 10px;border-radius:10px;border:1px dashed var(--line-2);color:var(--dim);font-size:12px}
.ghosts{display:flex}
.ghosts i{width:18px;height:18px;border-radius:50%;background:var(--line);border:2px solid var(--panel);margin-left:-6px}
.ghosts i:first-child{margin-left:0}
.show{position:relative;padding:72px 0 80px}
.show-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px;align-items:start}
.show-item{display:flex;flex-direction:column;gap:8px}
.show-item>.panel,.show-item>.term{margin-bottom:12px}
.show-item h3{margin:0;font-size:22px;line-height:1.15;text-wrap:balance}
.show-item p{margin:0;color:var(--muted);font-size:15px}
.wp{padding:16px;display:flex;flex-direction:column;gap:8px;min-height:212px;justify-content:center}
.wp-head{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:8px;border-bottom:1px solid var(--line);gap:12px;font-size:14px;font-weight:600}
.wp-head .mono{font-size:11px;color:var(--dim);font-weight:400}
.wp-line{display:grid;grid-template-columns:58px minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px 10px;border-radius:9px;border:1px solid var(--line);font-size:12.5px}
.wp-line.repeat{background:var(--accent);color:var(--on-accent);border-color:var(--accent);font-weight:600}
.wp-line.stop{color:#6B7585}
.wp-line .k{font-family:"JetBrains Mono",Menlo,monospace;font-size:10.5px;letter-spacing:.06em}
.wp-line .c{font-family:"JetBrains Mono",Menlo,monospace;font-size:11px;white-space:nowrap}
.linkbar{padding:12px 14px;border-radius:10px;background:var(--bg);border:1px solid var(--line);font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.stats .ui{padding:10px 12px}
.stats .ui .mono{font-size:18px}
.stats .ui span{display:block;font-size:11.5px;color:var(--dim)}
.term{background:#0B0E14;border:1px solid var(--line);border-radius:12px;overflow:hidden;font-family:"JetBrains Mono",Menlo,monospace;font-size:12px;line-height:1.6;color:var(--muted);min-height:212px}
.term-bar{display:flex;align-items:center;gap:12px;padding:9px 14px;border-bottom:1px solid var(--line);background:#0F131A;font-size:11px;color:var(--dim)}
.term-bar .lights{display:flex;gap:6px}
.term-bar .lights i{width:9px;height:9px;border-radius:50%;background:var(--line-2)}
.term-body{padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.tool{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}
.tool i{width:7px;height:7px;border-radius:50%;background:var(--accent);flex:none;position:relative;top:-1px}
.tool i.reply{background:var(--ink)}
.facts{position:relative;padding:56px 0}
.facts-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px}
.facts-grid h3{margin:0 0 6px;font-size:22px}
.facts-grid p{margin:0;color:var(--muted);font-size:15px}
.cta{position:relative;padding:112px 0 56px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px}
.cta h2{margin:0;font-size:clamp(40px,5vw,64px);line-height:1;max-width:980px;text-wrap:balance}
.cta p{margin:0;color:var(--muted);font-size:17px}
.foot{display:flex;gap:24px;font-size:13px;color:var(--dim);margin-top:28px;flex-wrap:wrap;justify-content:center}
@media (max-width:1100px){
  .sluice-grid{grid-template-columns:1fr;gap:16px}
  .arrow{transform:rotate(90deg)}
  .show-grid{grid-template-columns:1fr;gap:48px}
  .facts-grid{grid-template-columns:1fr;gap:24px}
}
@media (max-width:700px){
  .nav-links a:not(.btn):not(.nav-signin){display:none}
  .hero{padding:44px 0 36px}
  .hero p{font-size:16px}
  .wl-row{flex-direction:column}
  .sluice-panel{padding:18px}
  .sluice{padding:40px 0 48px}
  .show{padding:56px 0 64px}
  .cta{padding-top:80px}
  .hero h1{font-size:clamp(40px,11vw,52px)}
}
@media (prefers-reduced-motion:no-preference){
  .hero>*{animation:rise .5s cubic-bezier(.16,1,.3,1) both}
  @keyframes rise{from{opacity:.001;transform:translateY(8px)}to{opacity:1;transform:none}}
}
`;
