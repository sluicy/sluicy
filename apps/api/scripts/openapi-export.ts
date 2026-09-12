// Writes the OpenAPI document to apps/api/openapi.json. Run through `pnpm api:schema` at the repo root, which also
// regenerates the web client types. CI fails when the committed file is behind the routes.
import { writeFileSync } from "node:fs";
import { createDb } from "@sluicy/db";
import { createApp } from "../src/app.js";
import { readConfig } from "../src/config.js";

// postgres.js connects lazily, so a placeholder URL is enough to register the database-backed routes without a server.
const app = createApp({ config: readConfig({}), db: createDb("postgres://openapi@localhost/openapi"), mailer: async () => {} });
const doc = await app.request("/v1/openapi.json").then((r) => r.json());
writeFileSync(new URL("../openapi.json", import.meta.url), JSON.stringify(doc, null, 2) + "\n");
console.log("wrote apps/api/openapi.json");
