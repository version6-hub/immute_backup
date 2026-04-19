import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves project sites at https://<user>.github.io/<repo>/.
// If you publish under the repo name `immute_backup`, base must be
// "/immute_backup/". If you wire a custom domain (e.g. backup.immute.io)
// via a CNAME, set base to "/" — and either set BASE_PATH=/ at build time
// or change the literal below before pushing.
const BASE_PATH = process.env.BASE_PATH ?? "/immute_backup/";

export default defineConfig({
  plugins: [react()],
  base: BASE_PATH,
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "es2022",
  },
  // Reasonable dev defaults; production config is otherwise minimal so the
  // bundle stays small (smaller bundle = faster load = better fallback).
  server: { port: 5173 },
  preview: { port: 4173 },
});
