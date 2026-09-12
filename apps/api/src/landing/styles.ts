// Landing page styles on top of the shared tokens in ../ui/styles.ts.
import { baseCss } from "../ui/styles.js";

export const landingCss = baseCss + `
.wrap{max-width:1200px;margin:0 auto;padding-inline:24px}
.page{position:relative;overflow:hidden}
.noise{position:absolute;inset:0;opacity:.06;pointer-events:none;background-image:radial-gradient(#fff .6px,transparent .6px);background-size:3px 3px}
.glow{position:absolute;left:50%;top:-300px;width:1100px;max-width:100vw;height:700px;transform:translateX(-50%);background:radial-gradient(ellipse at center,rgba(77,141,255,.24) 0%,rgba(77,141,255,0) 60%);pointer-events:none}
.nav{position:relative;display:flex;align-items:center;justify-content:space-between;height:88px;gap:16px}
.wordmark{display:flex;align-items:center;gap:10px;font-weight:800;font-size:24px}
.nav-links{display:flex;align-items:center;gap:30px;font-size:15px;color:var(--muted);font-weight:500}
.nav-links a:hover{color:var(--ink)}
.hero{position:relative;padding:88px 0 56px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:26px}
.hero h1{margin:0;font-weight:800;font-size:clamp(52px,7.2vw,104px);line-height:.94;max-width:1100px;text-wrap:balance}
.hero p{margin:0;font-size:21px;color:var(--muted);max-width:640px;text-wrap:balance}
.dot{width:8px;height:8px;border-radius:50%;background:var(--accent);display:inline-block}
.wl{display:flex;flex-direction:column;align-items:center;gap:10px;width:100%;max-width:520px}
.wl-row{display:flex;gap:8px;width:100%}
.wl input{flex:1;min-width:0;height:52px;border-radius:999px;border:1px solid var(--line-2);background:var(--panel);color:var(--ink);padding:0 20px;font:inherit;font-size:15px}
.wl input::placeholder{color:#6B7585}
.wl input:focus-visible,.btn:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.wl small{font-size:13px;color:var(--dim)}
.wl-done{border:1px solid var(--accent);border-radius:12px;padding:14px 18px;color:var(--ink);font-size:15px;max-width:520px}
.wl-err{color:var(--stop);font-size:14px}
.sluice{position:relative;padding:24px 0 0}
.sluice-panel{padding:36px 40px 32px;display:flex;flex-direction:column;gap:28px;box-shadow:0 40px 100px -40px rgba(0,0,0,.9)}
.sluice-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
.sluice-grid{display:grid;grid-template-columns:300px 44px minmax(0,1fr) 44px 260px;align-items:center}
.arrow{display:flex;justify-content:center;color:var(--dim)}
.pieces{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.piece{padding:12px;border-radius:10px;background:var(--panel);border:1px solid var(--line);display:flex;flex-direction:column;gap:6px;font-size:12px}
.piece b{font-weight:600;line-height:1.3}
.piece span{font-family:"JetBrains Mono",Menlo,monospace;font-size:10.5px;color:var(--dim)}
.col-label{font-family:"JetBrains Mono",Menlo,monospace;font-size:11px;letter-spacing:.12em;color:var(--dim);margin-bottom:4px}
.box{position:relative;border:2px solid var(--accent);border-radius:14px;padding:22px 22px 18px;display:flex;flex-direction:column;gap:14px;background:linear-gradient(180deg,rgba(77,141,255,.10),rgba(77,141,255,0))}
.box-tag{position:absolute;top:-14px;left:20px;background:var(--panel);padding:0 8px}
.steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;font-size:12.5px}
.steps .ui{padding:12px;display:flex;flex-direction:column;gap:4px}
.steps .ui span{font-family:"JetBrains Mono",Menlo,monospace;font-size:10.5px;color:var(--dim)}
.riffles{display:flex;gap:6px;align-items:center}
.riffles i{flex:1;height:8px;border-radius:4px;background:repeating-linear-gradient(90deg,var(--accent) 0 14px,transparent 14px 22px)}
.riffles span{font-family:"JetBrains Mono",Menlo,monospace;font-size:11px;color:var(--dim)}
.out{display:flex;flex-direction:column;gap:12px}
.out-card{border-radius:10px;background:var(--accent);color:var(--on-accent);padding:12px 14px;display:flex;flex-direction:column;gap:4px}
.out-card b{font-weight:700;font-size:13px}
.out-card span{font-family:"JetBrains Mono",Menlo,monospace;font-size:12px}
.out-none{border-radius:10px;border:1px dashed var(--line-2);padding:10px 14px;color:var(--dim);font-size:12.5px}
.rows{position:relative;padding:120px 0 0;display:flex;flex-direction:column;gap:110px}
.row{display:grid;grid-template-columns:460px minmax(0,1fr);gap:80px;align-items:center}
.row.flip{grid-template-columns:minmax(0,1fr) 460px}
.row-copy{display:flex;flex-direction:column;gap:16px}
.row-copy h2{margin:0;font-weight:800;font-size:48px;line-height:1;text-wrap:balance}
.row-copy p{margin:0;color:var(--muted);font-size:18px}
.wp{padding:24px;display:flex;flex-direction:column;gap:12px}
.wp-head{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:12px;border-bottom:1px solid var(--line);gap:12px;flex-wrap:wrap}
.wp-line{display:grid;grid-template-columns:110px minmax(0,1fr) 120px;gap:14px;align-items:center;padding:12px 14px;border-radius:10px;border:1px solid var(--line);font-size:14px}
.wp-line.repeat{background:var(--accent);color:var(--on-accent);border-color:var(--accent);font-weight:600}
.wp-line.stop{color:#6B7585}
.wp-line .k{font-family:"JetBrains Mono",Menlo,monospace;font-size:11px;letter-spacing:.12em}
.wp-line .c{font-family:"JetBrains Mono",Menlo,monospace;font-size:12px;text-align:right}
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.stats .ui{padding:12px}
.stats .ui span{display:block;font-size:11.5px;color:var(--dim)}
.term{background:#0B0E14;border:1px solid var(--line);border-radius:12px;overflow:hidden;font-family:"JetBrains Mono",Menlo,monospace;font-size:13px;line-height:1.7;color:var(--muted)}
.term-bar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--line);background:#0F131A;font-size:11.5px;color:var(--dim);gap:12px}
.term-bar .lights{display:flex;gap:8px}
.term-bar .lights i{width:10px;height:10px;border-radius:50%;background:var(--line-2)}
.term-body{padding:18px 20px;display:flex;flex-direction:column;gap:12px}
.tool{display:flex;gap:10px;align-items:baseline}
.tool i{width:8px;height:8px;border-radius:50%;background:var(--accent);flex:none;position:relative;top:-1px}
.tool i.reply{background:var(--ink)}
.tool-out{padding-left:18px;white-space:pre-line}
.term-foot{margin-top:6px;padding-top:12px;border-top:1px solid var(--line);display:flex;justify-content:space-between;font-size:11.5px;color:var(--dim)}
.facts{position:relative;padding:120px 0 0}
.rule{height:1px;background:var(--line)}
.facts-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:40px;padding:40px 0}
.facts-grid h3{margin:0 0 8px;font-size:30px;font-weight:800}
.facts-grid p{margin:0;color:var(--muted);font-size:15.5px}
.cta{position:relative;padding:110px 0 60px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:24px}
.cta h2{margin:0;font-weight:800;font-size:clamp(40px,5vw,64px);line-height:.98;max-width:980px;text-wrap:balance}
.cta p{margin:0;color:var(--muted);font-size:18px}
.foot{display:flex;gap:28px;font-size:13px;color:var(--dim);margin-top:30px;flex-wrap:wrap;justify-content:center}
@media (max-width:1100px){
  .sluice-grid{grid-template-columns:1fr;gap:18px}
  .arrow{transform:rotate(90deg)}
  .row,.row.flip{grid-template-columns:1fr;gap:32px}
  .row.flip .row-copy{order:-1}
  .facts-grid{grid-template-columns:1fr;gap:28px}
}
@media (max-width:700px){
  .nav-links a:not(.btn):not(.nav-signin){display:none}
  .hero{padding:56px 0 40px}
  .hero p{font-size:18px}
  .wl-row{flex-direction:column}
  .sluice-panel{padding:22px 18px}
  .stats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .wp-line{grid-template-columns:1fr;gap:6px}
  .wp-line .c{text-align:left}
  .row-copy h2{font-size:36px}
  .rows{padding-top:80px;gap:72px}
  .facts,.cta{padding-top:72px}
}
@media (prefers-reduced-motion:no-preference){
  .hero>*{animation:rise .5s ease both}
  @keyframes rise{from{opacity:.001;transform:translateY(8px)}to{opacity:1;transform:none}}
}
`;
