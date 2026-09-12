import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const workspace = (p: string) => fileURLToPath(new URL(`../../packages/${p}/src/index.ts`, import.meta.url));

export default defineConfig({
  test: { include: ["src/**/*.test.ts"], fileParallelism: false },
  // Workspace packages export their built JS; tests read the TypeScript source so a stale dist never lies.
  resolve: { alias: { "@sluicy/db": workspace("db"), "@sluicy/storage": workspace("storage") } },
  esbuild: { jsx: "automatic", jsxImportSource: "hono/jsx" },
});
