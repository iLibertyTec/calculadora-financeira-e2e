import type { Handlers } from "$fresh/server.ts";
import { SERVICE_INFO } from "../src/service_info.ts";

export const handler: Handlers = {
  GET(_req: Request): Response {
    return new Response(
      JSON.stringify({
        ok: true,
        service: SERVICE_INFO.name,
        version: SERVICE_INFO.version,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      },
    );
  },
};
