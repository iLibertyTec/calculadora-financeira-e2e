import { SERVICE_INFO } from "../src/service_info.ts";

type HealthResponse = {
  ok: boolean;
  service: string;
  version: string;
};

export const handler = {
  GET(): Response {
    const body: HealthResponse = {
      ok: true,
      service: SERVICE_INFO.name,
      version: SERVICE_INFO.version,
    };

    return Response.json(body, {
      headers: {
        "cache-control": "no-store",
        "content-type": "application/json; charset=utf-8",
      },
    });
  },
};
