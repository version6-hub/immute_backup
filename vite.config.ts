import {createHash} from "node:crypto";
import {readdirSync,readFileSync} from "node:fs";
const hash=createHash("sha256");
function source(dir:string){for(const entry of readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const p=dir+"/"+entry.name;if(entry.isDirectory())source(p);else if(entry.isFile())hash.update(p+"\0").update(readFileSync(p)).update("\0");}}
source("src");for(const p of ["index.html","package.json","vite.config.ts"])hash.update(p).update(readFileSync(p));
const siteRelease=hash.digest("hex").slice(0,32);
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves project sites at https://<user>.github.io/<repo>/.
// If you publish under the repo name `immute_backup`, base must be
// "/immute_backup/". If you wire a custom domain (e.g. backup.immute.io)
// via a CNAME, set base to "/" — and either set BASE_PATH=/ at build time
// or change the literal below before pushing.
const BASE_PATH = process.env.BASE_PATH ?? "/immute_backup/";

export default defineConfig({
  plugins: [react(), {name:"site-release",generateBundle(){this.emitFile({type:"asset",fileName:"release.json",source:JSON.stringify({release:siteRelease,chainId:1})});}}],
  define:{__SITE_RELEASE__:JSON.stringify(siteRelease)},
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
