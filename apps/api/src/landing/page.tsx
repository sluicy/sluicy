import type { FC } from "hono/jsx";
import { landingCss } from "./styles.js";

export type WaitlistState =
  | { kind: "idle" }
  | { kind: "joined" }
  | { kind: "error"; message: string };

const Logo: FC = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M3 8 L25 8 L21 20 L7 20 Z" fill="#4D8DFF" />
    <path d="M8 14 H20" stroke="#061029" stroke-width="2.5" stroke-linecap="round" />
    <path d="M10 11 H18" stroke="#061029" stroke-width="2.5" stroke-linecap="round" />
  </svg>
);

const Arrow: FC = () => (
  <div class="arrow" aria-hidden="true">
    <svg width="40" height="24" viewBox="0 0 40 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M2 12h34M28 4l8 8-8 8" />
    </svg>
  </div>
);

const Waitlist: FC<{ state: WaitlistState; id: string; email?: string }> = ({ state, id, email }) => {
  if (state.kind === "joined") {
    return (
      <div class="wl-done" aria-live="polite">
        <strong>You're on the list.</strong> We'll email you when your batch opens. Until then, keep writing.
      </div>
    );
  }
  return (
    <form class="wl" method="post" action="/waitlist" id={id}>
      <div class="wl-row">
        <label for={`${id}-email`} style="position:absolute;left:-9999px">Email</label>
        <input type="email" name="email" id={`${id}-email`} placeholder="you@yourproduct.com" autocomplete="email" required value={email ?? ""} />
        <button class="btn btn-accent" type="submit">Join the waitlist</button>
      </div>
      <input type="hidden" name="form" value={id} />
      {state.kind === "error" ? <div class="wl-err" role="alert">{state.message}</div> : null}
      <small>Small batches. The first hundred founders lock $19 a month for life.</small>
    </form>
  );
};

export const LandingPage: FC<{ state: WaitlistState; email?: string; appUrl: string }> = ({ state, email, appUrl }) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Sluicy · Find the content that pays</title>
      <meta name="description" content="Open-source growth analytics for solo founders. Sluicy tracks every post, article and answer to signups, Stripe revenue and retention, then tells you what to repeat next week." />
      <meta property="og:title" content="Sluicy · Post a lot. Keep what pays." />
      <meta property="og:description" content="Open-source growth analytics for founders who market with content, not ads." />
      <meta property="og:type" content="website" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: landingCss }} />
    </head>
    <body>
      <div class="page">
        <div class="noise" aria-hidden="true"></div>
        <div class="glow" aria-hidden="true"></div>

        <header class="wrap nav">
          <a class="wordmark display" href="/"><Logo />Sluicy</a>
          <nav class="nav-links">
            <a href="#how">How it works</a>
            <a href="https://github.com/sluicy/sluicy">GitHub</a>
            <a href="#facts">Pricing</a>
            <a class="nav-signin" href={`${appUrl}/sign-in`}>Sign in</a>
            <a class="btn btn-accent" href="#join" style="height:42px">Get early access</a>
          </nav>
        </header>

        <section class="wrap hero" id="join">
          <div class="label" style="display:flex;align-items:center;gap:10px">
            <span class="dot"></span>Growth analytics for solo founders · open source
          </div>
          <h1 class="display">
            Post a lot.<br />Keep what <span style="color:var(--accent)">pays.</span>
          </h1>
          <p>Sluicy sorts your content the way a sluice sorts a riverbed: every post, article and answer runs through it, and only the ones that turned into paying customers come out the other side.</p>
          <Waitlist state={state} id="hero" email={email} />
        </section>

        <section class="wrap sluice" id="how">
          <div class="panel sluice-panel">
            <div class="sluice-head">
              <div class="label">What goes in · what comes out</div>
              <div class="mono" style="font-size:12px;color:var(--dim)">example product · last 30 days</div>
            </div>
            <div class="sluice-grid">
              <div>
                <div class="col-label">EVERYTHING YOU PUBLISHED</div>
                <div class="pieces">
                  <div class="piece"><b>How I got 400 users from one Reddit answer</b><span>X · article</span></div>
                  <div class="piece"><b>We just shipped dark mode</b><span>LinkedIn · announcement</span></div>
                  <div class="piece"><b>Reply in r/SaaS on tracking</b><span>Reddit · answer</span></div>
                  <div class="piece"><b>Attribution in 10 minutes</b><span>YouTube · tutorial</span></div>
                  <div class="piece"><b>MRR update, week 31</b><span>X · post</span></div>
                  <div class="piece"><b>Cold email numbers, all of them</b><span>X · article</span></div>
                </div>
              </div>
              <Arrow />
              <div class="box">
                <div class="box-tag label">SLUICY</div>
                <div class="steps">
                  <div class="ui"><span>1 · LINK</span>One link per piece, on your domain</div>
                  <div class="ui"><span>2 · VISIT</span>First and last touch, 30-day window</div>
                  <div class="ui"><span>3 · SIGNUP</span>One call from your backend</div>
                  <div class="ui"><span>4 · STRIPE</span>Payment, refund, churn, reconciled</div>
                </div>
                <div class="riffles"><i></i><span>riffles: placement × format</span></div>
              </div>
              <Arrow />
              <div class="out">
                <div class="col-label" style="color:var(--accent)">WHAT PAID</div>
                <div class="out-card"><b>How I got 400 users from one Reddit answer</b><span>63 signups · $1,140</span></div>
                <div class="out-card"><b>Reply in r/SaaS</b><span>21 signups · $399</span></div>
                <div class="out-card"><b>Attribution in 10 minutes</b><span>14 signups · $95</span></div>
                <div class="col-label" style="margin-top:6px">WHAT DIDN'T</div>
                <div class="out-none">3 pieces · 4,100 visits · <span class="mono">$0</span></div>
              </div>
            </div>
          </div>
        </section>

        <section class="wrap rows">
          <div class="row">
            <div class="row-copy">
              <div class="label">Every Monday</div>
              <h2 class="display">Repeat. Test. Stop.</h2>
              <p>Not a dashboard to stare at. One page that says what to do this week, with the numbers behind each call and how sure it is. When there is not enough data, it says that too.</p>
            </div>
            <div class="panel wp">
              <div class="wp-head">
                <div class="display" style="font-weight:700;font-size:18px">Week 37 · example product</div>
                <div class="mono" style="font-size:12px;color:var(--dim)">41 pieces · 118 signups</div>
              </div>
              <div class="wp-line repeat"><span class="k">REPEAT</span><span>Tutorial articles on X. 4 of 4 earned.</span><span class="c">high confidence</span></div>
              <div class="wp-line"><span class="k" style="color:var(--accent)">TEST</span><span>One Reddit answer a day. 2 pieces so far.</span><span class="c" style="color:var(--dim)">not enough data</span></div>
              <div class="wp-line stop"><span class="k" style="color:var(--stop)">STOP</span><span>Feature announcements. 5,800 visits, $0 in 30 days.</span><span class="c">high confidence</span></div>
              <div style="display:flex;gap:8px;margin-top:4px;flex-wrap:wrap">
                <span class="chip chip-fill">Email</span><span class="chip chip-fill">MCP</span><span class="chip chip-fill">Postiz drafts</span>
              </div>
            </div>
          </div>

          <div class="row flip">
            <div class="panel wp">
              <div class="col-label">NEW PIECE</div>
              <div style="font-size:16px;font-weight:600">How I got 400 users from one Reddit answer</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <span class="chip chip-line">X · article</span><span class="chip chip-line">tutorial</span><span class="chip chip-line">hook: real number</span><span class="chip chip-fill">tagged automatically</span>
              </div>
              <div class="ui" style="padding:16px 18px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
                <div class="mono" style="font-size:15px">yourproduct.com<span style="color:var(--accent)">/go/reddit-attribution</span></div>
                <span class="chip chip-accent" style="height:30px">Copy link</span>
              </div>
              <div class="stats">
                <div class="ui"><div class="mono" style="font-size:20px">1,842</div><span>clicks</span></div>
                <div class="ui"><div class="mono" style="font-size:20px">63</div><span>signups</span></div>
                <div class="ui"><div class="mono" style="font-size:20px;color:var(--accent)">$1,140</div><span>revenue</span></div>
                <div class="ui"><div class="mono" style="font-size:20px">84%</div><span>kept after 90d</span></div>
              </div>
            </div>
            <div class="row-copy">
              <div class="label">Per piece, not per platform</div>
              <h2 class="display">A link that lives on your domain.</h2>
              <p>Reddit and X bury shortener domains. Sluicy links look like a page on your site, land anywhere you choose, and carry the piece all the way to the Stripe payment and whether that customer stayed.</p>
            </div>
          </div>

          <div class="row">
            <div class="row-copy">
              <div class="label">Agent-native</div>
              <h2 class="display">Your agent does the rest.</h2>
              <p>An MCP server and a skill file. Claude Code, OpenClaw or Hermes reads the ledger, writes the briefs and drops them into Postiz as drafts. You keep the twenty minutes that matter: writing.</p>
            </div>
            <div class="term">
              <div class="term-bar">
                <div class="lights" aria-hidden="true"><i></i><i></i><i></i></div>
                <div>claude · ~/yourproduct</div>
                <div>sluicy mcp · connected</div>
              </div>
              <div class="term-body">
                <div style="color:var(--ink)"><span style="color:var(--accent)">{">"}</span> what should I post this week?</div>
                <div>
                  <div class="tool"><i></i><span style="color:var(--ink)">sluicy · get_weekly_page</span><span style="color:var(--dim)">(product: "yourproduct")</span></div>
                  <div class="tool-out">{"└ Repeat · tutorial articles on X · 4/4 earned · $1,634\n  Test · one Reddit answer a day · 2 pieces so far\n  Stop · announcements · 5,800 visits · $0"}</div>
                </div>
                <div>
                  <div class="tool"><i></i><span style="color:var(--ink)">sluicy · push_brief</span><span style="color:var(--dim)">(scheduler: "postiz", briefs: 2)</span></div>
                  <div class="tool-out">└ 2 drafts created</div>
                </div>
                <div class="tool"><i class="reply"></i><span style="color:var(--ink)">Two briefs are waiting in Postiz. You write the words, I did the rest.</span></div>
                <div class="term-foot"><span><span style="color:var(--accent)">{">"}</span> _</span><span>? for shortcuts</span></div>
              </div>
            </div>
          </div>
        </section>

        <section class="wrap facts" id="facts">
          <div class="rule"></div>
          <div class="facts-grid">
            <div><h3 class="display">Open source</h3><p>AGPL, TypeScript, Postgres only. One command to self-host. Your data stays on your server.</p></div>
            <div><h3 class="display">$19 a month</h3><p>Hosted, unlimited products, priced by visits with a warning and never a cut-off. Or free, on your own box.</p></div>
            <div><h3 class="display">Not a scheduler</h3><p>Postiz, Typefully and Buffer exist. Sluicy plugs into them. It will never write your post either.</p></div>
          </div>
          <div class="rule"></div>
        </section>

        <section class="wrap cta">
          <h2 class="display">Find the content that turns readers into customers.</h2>
          <p>Early access opens in small batches. Built in public, ledger and all.</p>
          <Waitlist state={state} id="footer" email={email} />
          <div class="foot">
            <span>Sluicy · from <em>sluice</em>, the box that separates gold from dirt</span>
            <a href="https://github.com/sluicy/sluicy">github.com/sluicy/sluicy</a>
            <span>AGPL-3.0</span>
          </div>
        </section>
      </div>
    </body>
  </html>
);
