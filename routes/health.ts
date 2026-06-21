import type { Handlers } from "$fresh/server.ts";
import { APP_VERSION, SERVICE_NAME } from "../src/app_info.ts";

const HEALTH_PAYLOAD = {
  ok: true,
  service: SERVICE_NAME,
  version: APP_VERSION,
};

export const handler: Handlers = {
  GET(_req: Request): Response {
    return new Response(JSON.stringify(HEALTH_PAYLOAD), {
      status: 200,
      headers: {
        "cache-control": "no-store",
        "content-type": "application/json; charset=utf-8",
      },
    });
  },
};
