import { Hono } from "hono";

export const publicPages = new Hono();

// Opt-in per Product. Scaffold renders a placeholder with the Open Graph tags the real page will carry.
publicPages.get("/:product", (c) => {
  const product = c.req.param("product");
  return c.html(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{product} · Sluicy</title>
        <meta property="og:title" content={`${product} · public growth page`} />
        <meta property="og:description" content="Visits, signups and revenue by content. Powered by Sluicy." />
      </head>
      <body style="font-family: system-ui; padding: 2rem">
        <h1>{product}</h1>
        <p>This Product has not opted in to a public page yet.</p>
        <p>
          <a href="https://github.com/sluicy/sluicy">Sluicy</a> · open-source growth analytics
        </p>
      </body>
    </html>,
  );
});
