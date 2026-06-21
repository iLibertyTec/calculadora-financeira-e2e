import { defineConfig } from "vite";
import fresh from "@fresh/plugin-vite";
import config from "./fresh.config.ts";

export default defineConfig({
  plugins: [fresh(config)],
});
