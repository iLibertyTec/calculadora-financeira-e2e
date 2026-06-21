import { createDefine } from "$fresh/server.ts";
import config from "./fresh.config.ts";

export const define = createDefine(config);
export const app = define.app();

export async function handler(request: Request): Promise<Response> {
  const freshHandler = app.handler();
  return await freshHandler(request);
}

if (import.meta.main) {
  const port = Number(Deno.env.get("PORT") ?? 8000);
  console.log(`iFactory Product on http://localhost:${port}`);
  Deno.serve({ port }, handler);
}
