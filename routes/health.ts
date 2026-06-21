import { Handlers } from "$fresh/server.ts";
import { APP_VERSION, SERVICE_NAME } from "../src/app_info.ts";

export const handler: Handlers = {
  GET(_req: Request): Response {
    return Response.json({
      ok: true,
      service: SERVICE_NAME,
      version: APP_VERSION,
    });
  },
};
