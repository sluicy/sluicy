import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.WEB_PORT ?? 5173),
    proxy: { "/v1": "http://localhost:8787", "/health": "http://localhost:8787" },
  },
});
