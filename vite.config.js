import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
  },
  server: {
    allowedHosts: ["localhost", "untref.loca.lt"],
  },
});
