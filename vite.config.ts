import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";

export default defineConfig({
  plugins: [fresh()],
  ssr: {
    noExternal: ["$fresh", "$fresh/", "preact", "preact-render-to-string"],
  },
});
