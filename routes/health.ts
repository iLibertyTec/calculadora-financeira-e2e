import { Handlers } from "$fresh/server.ts";
import { SERVICE_INFO } from "../src/service_info.ts";

type HealthResponse = {
  ok: boolean;
  service: string;
  version: string;
};

export const handler: Handlers = {
  GET() {
    const body: HealthResponse = {
      ok: true,
      service: SERVICE_INFO.name,
      version: SERVICE_INFO.version,
    };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  },
};
