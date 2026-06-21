import type { Handlers } from "$fresh/server.ts";
import { SERVICE_INFO } from "../src/service_info.ts";

export const handler: Handlers = {
  GET(_req: Request): Response {
    return Response.json({
      ok: true,
      service: SERVICE_INFO.name,
      version: SERVICE_INFO.version,
    });
  },
};
