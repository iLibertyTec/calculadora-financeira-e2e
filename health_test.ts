import { assertEquals } from "@std/assert";
import { handler } from "./main.ts";
import { SERVICE_INFO } from "./src/service_info.ts";

type HealthResponse = {
  ok: boolean;
  service: string;
  version: string;
};

Deno.test("GET /health returns the service contract", async () => {
  const res = await handler(new Request("http://localhost/health"));
  const body = await res.json() as HealthResponse;

  assertEquals(res.status, 200);
  assertEquals(body, {
    ok: true,
    service: SERVICE_INFO.name,
    version: SERVICE_INFO.version,
  });
});
