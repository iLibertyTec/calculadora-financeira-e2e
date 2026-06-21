import { createDefine } from "$fresh/server.ts";
import config from "./fresh.config.ts";

export const define = createDefine(config);
export const app = define.app();
const freshHandler: (request: Request) => Promise<Response> = app.handler();

export const handler = (request: Request): Promise<Response> => {
  return freshHandler(request);
};

if (import.meta.main) {
  const port = Number(Deno.env.get("PORT") ?? 8000);
  console.log(`iFactory Product on http://localhost:${port}`);
  Deno.serve({ port }, handler);
}
