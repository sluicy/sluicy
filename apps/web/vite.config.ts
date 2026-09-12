import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.WEB_PORT ?? 5173),
    // Everything the API owns at the app origin: JSON, health and the server-rendered sign-in pages.
    proxy: Object.fromEntries(["/v1", "/health", "/sign-in", "/sign-out"].map((p) => [p, "http://localhost:8787"])),
  },
});
