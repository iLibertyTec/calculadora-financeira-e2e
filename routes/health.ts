import type { Handlers } from "$fresh/server.ts";
import { APP_VERSION, SERVICE_NAME } from "../src/app_info.ts";

export type HealthPayload = {
  ok: true;
  service: string;
  version: string;
};

export function createHealthPayload(
  service: string = SERVICE_NAME,
  version: string = APP_VERSION,
): HealthPayload {
  return {
    ok: true,
    service,
    version,
  };
}

export const handler: Handlers = {
  GET(_req: Request): Response {
    return new Response(JSON.stringify(createHealthPayload()), {
      status: 200,
      headers: {
        "cache-control": "no-store",
        "content-type": "application/json; charset=utf-8",
      },
    });
  },
};
