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

/** Platform marks, one stroke weight, 16px. */
const Icon: FC<{ name: "reddit" | "x" | "substack" | "linkedin" | "youtube" | "link" | "eye" | "user" | "card" }> = ({ name }) => {
  const paths: Record<string, string> = {
    reddit: "M12 4l1.2 3.1M13.2 7.1a1.4 1.4 0 1 0 2.8 0a1.4 1.4 0 1 0-2.8 0M4 13.5a8 4.5 0 1 0 16 0a8 4.5 0 1 0-16 0M9 13h.01M15 13h.01M9.5 16c1.5 1 3.5 1 5 0",
    x: "M5 4l14 16M19 4L5 20",
    substack: "M5 5h14M5 9.5h14M5 14h14v6l-7-3.5L5 20z",
    linkedin: "M6 10v8M6 6.5v.01M11 18v-8M11 13.5c0-2 1.3-3.5 3.5-3.5S18 11.5 18 13.5V18",
    youtube: "M3.5 8.5a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3zM10 9.5v5l4.5-2.5z",
    link: "M10 14a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7L11.5 6.8M14 10a4 4 0 0 0-5.7 0l-2.8 2.8a4 4 0 0 0 5.7 5.7l1.3-1.3",
    eye: "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6zM12 12m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0",
    card: "M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M7 15h4",
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
};

type Platform = "reddit" | "x" | "substack" | "linkedin" | "youtube";
const platformName: Record<Platform, string> = { reddit: "r/SaaS", x: "X", substack: "Substack", linkedin: "LinkedIn", youtube: "YouTube" };

/** A published Piece as it looks on its platform. `paid` marks the ones that turned into Customers. */
const Post: FC<{ platform: Platform; author: string; text: string; meta: string; paid?: boolean }> = ({ platform, author, text, meta, paid }) => (
  <div class={`post${paid ? " post-paid" : ""}`}>
    <div class="post-head"><Icon name={platform} /><b>{author}</b><span>{platformName[platform]}</span></div>
    <p>{text}</p>
    <div class="post-meta">{meta}</div>
  </div>
);

/** A Customer, shown as a person: initials, name, what they pay, and the Piece that brought them. */
const Person: FC<{ initials: string; name: string; amount: string; from: Platform }> = ({ initials, name, amount, from }) => (
  <div class="person">
    <span class="avatar" data-from={from}>{initials}</span>
    <span class="person-name">{name}</span>
    <span class="person-from"><Icon name={from} /></span>
    <span class="person-amt mono">{amount}</span>
  </div>
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
            <a class="btn btn-accent btn-sm" href="#join">Get early access</a>
          </nav>
        </header>

        <section class="wrap hero" id="join">
          <h1 class="display">Post a lot. Keep what <span style="color:var(--accent)">pays.</span></h1>
          <p>Open-source growth analytics for founders who market with content. Every post, article and answer, followed to the Stripe payment.</p>
          <Waitlist state={state} id="hero" email={email} />
        </section>

        <section class="wrap sluice" id="how">
          <div class="panel sluice-panel">
            <div class="sluice-grid">
              <div class="col">
                <div class="col-label"><Icon name="eye" />What you published</div>
                <div class="posts">
                  <Post platform="reddit" author="u/you" text="We tried 4 attribution tools before writing our own. Here is what each one got wrong…" meta="↑ 412 · 38 comments" paid />
                  <Post platform="x" author="@you" text="How one Reddit answer brought us 400 users. Thread." meta="1.8k views · 24 reposts" paid />
                  <Post platform="substack" author="Your newsletter" text="Issue 31: cold email numbers, all of them" meta="2,100 opens" paid />
                  <Post platform="linkedin" author="You" text="We just shipped dark mode 🎉" meta="5,800 impressions" />
                  <Post platform="youtube" author="Your channel" text="Attribution in 10 minutes" meta="960 views" />
                </div>
              </div>
              <Arrow />
              <div class="box">
                <div class="box-tag"><Logo />Sluicy</div>
                <ol class="flow">
                  <li><Icon name="link" /><span>One link per post, on your domain</span></li>
                  <li><Icon name="eye" /><span>Visit, first and last touch</span></li>
                  <li><Icon name="user" /><span>Signup, one call from your backend</span></li>
                  <li><Icon name="card" /><span>Stripe payment, refund, churn</span></li>
                </ol>
                <div class="riffles"><i></i></div>
              </div>
              <Arrow />
              <div class="col">
                <div class="col-label accent"><Icon name="card" />Who paid · $1,634</div>
                <div class="people">
                  <Person initials="MK" name="Marta K." amount="$49/mo" from="reddit" />
                  <Person initials="DP" name="Dev P." amount="$49/mo" from="reddit" />
                  <Person initials="JL" name="Jonas L." amount="$19/mo" from="x" />
                  <Person initials="AS" name="Aiko S." amount="$99/mo" from="reddit" />
                  <Person initials="RB" name="Rui B." amount="$19/mo" from="substack" />
                  <Person initials="TN" name="Tomás N." amount="$49/mo" from="x" />
                </div>
                <div class="nobody">
                  <span class="ghosts" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
                  <span>LinkedIn and YouTube: 6,760 visits, nobody paid</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="wrap show">
          <div class="show-item">
            <div class="panel wp">
              <div class="wp-head"><span class="display">Week 37</span><span class="mono">41 pieces · 118 signups</span></div>
              <div class="wp-line repeat"><span class="k">REPEAT</span><span>Reddit answers on attribution</span><span class="c">4 of 4 earned</span></div>
              <div class="wp-line"><span class="k" style="color:var(--accent)">TEST</span><span>One Substack issue a week</span><span class="c">2 so far</span></div>
              <div class="wp-line stop"><span class="k" style="color:var(--stop)">STOP</span><span>Feature announcements</span><span class="c">$0 in 30 days</span></div>
            </div>
            <h2 class="display">Every Monday: repeat, test, stop.</h2>
            <p>One page. Numbers and confidence behind each call.</p>
          </div>

          <div class="show-item">
            <div class="panel wp">
              <div class="linkbar mono">yourproduct.com<span style="color:var(--accent)">/go/reddit-attribution</span></div>
              <div class="stats">
                <div class="ui"><div class="mono">1,842</div><span>clicks</span></div>
                <div class="ui"><div class="mono">63</div><span>signups</span></div>
                <div class="ui"><div class="mono" style="color:var(--accent)">$1,140</div><span>revenue</span></div>
                <div class="ui"><div class="mono">84%</div><span>kept 90d</span></div>
              </div>
            </div>
            <h2 class="display">A link on your own domain.</h2>
            <p>Reddit and X bury shorteners. Yours looks like a page on your site.</p>
          </div>

          <div class="show-item">
            <div class="term">
              <div class="term-bar"><div class="lights" aria-hidden="true"><i></i><i></i><i></i></div><div>claude · sluicy mcp</div></div>
              <div class="term-body">
                <div style="color:var(--ink)"><span style="color:var(--accent)">{">"}</span> what should I post this week?</div>
                <div class="tool"><i></i><span>get_weekly_page</span></div>
                <div class="tool"><i></i><span>push_brief</span><span style="color:var(--dim)">postiz · 2 drafts</span></div>
                <div class="tool"><i class="reply"></i><span style="color:var(--ink)">Two briefs are waiting. You write the words.</span></div>
              </div>
            </div>
            <h2 class="display">Your agent does the rest.</h2>
            <p>MCP server and a skill file. Briefs land in Postiz as drafts.</p>
          </div>
        </section>

        <section class="wrap facts" id="facts">
          <div class="rule"></div>
          <div class="facts-grid">
            <div><h3 class="display">Open source</h3><p>AGPL, TypeScript, Postgres only. One command to self-host.</p></div>
            <div><h3 class="display">$19 a month</h3><p>Hosted, priced by visits. Warned, never cut off. Or free on your box.</p></div>
            <div><h3 class="display">Not a scheduler</h3><p>Plugs into Postiz, Typefully and Buffer. Never writes your post.</p></div>
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
