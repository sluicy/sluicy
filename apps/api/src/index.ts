import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { createMailer } from "./auth/index.js";
import { readConfig } from "./config.js";
import { getDb } from "./db.js";

const config = readConfig();
const app = createApp({ config, db: getDb(), mailer: createMailer(config) });

const port = Number(process.env.API_PORT ?? 8787);
serve({ fetch: app.fetch, port }, () => {
  console.log(`sluicy api listening on http://localhost:${port}`);
});
