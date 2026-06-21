import { assertEquals } from "@std/assert";
import { app, handler } from "./main.ts";
import { SERVICE_INFO } from "./src/service_info.ts";

type HealthResponse = {
  ok: boolean;
  service: string;
  version: string;
};

Deno.test("GET /health returns the service contract via handler", async () => {
  const res = await handler(new Request("http://localhost/health"));
  const body = await res.json() as HealthResponse;

  assertEquals(res.status, 200);
  assertEquals(res.headers.get("content-type"), "application/json; charset=utf-8");
  assertEquals(res.headers.get("cache-control"), "no-store");
  assertEquals(body, {
    ok: true,
    service: SERVICE_INFO.name,
    version: SERVICE_INFO.version,
  });
});

Deno.test("GET /health returns the service contract via app.handler()", async () => {
  const freshHandler = app.handler();
  const res = await freshHandler(new Request("http://localhost/health"));
  const body = await res.json() as HealthResponse;

  assertEquals(res.status, 200);
  assertEquals(res.headers.get("content-type"), "application/json; charset=utf-8");
  assertEquals(res.headers.get("cache-control"), "no-store");
  assertEquals(body, {
    ok: true,
    service: SERVICE_INFO.name,
    version: SERVICE_INFO.version,
  });
});
