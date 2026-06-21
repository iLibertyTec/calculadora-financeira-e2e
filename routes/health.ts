import type { Handlers } from "$fresh/server.ts";
import { APP_VERSION, SERVICE_NAME } from "../src/app_info.ts";

export const handler: Handlers = {
  GET(_req: Request): Response {
    return new Response(
      JSON.stringify({
        ok: true,
        service: SERVICE_NAME,
        version: APP_VERSION,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      },
    );
  },
};
