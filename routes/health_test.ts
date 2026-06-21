import { assertEquals } from "@std/assert";
import { handler } from "./health.ts";
import { SERVICE_INFO } from "../src/service_info.ts";

Deno.test("GET /health retorna contrato de saúde", async () => {
  const request = new Request("http://localhost/health", { method: "GET" });
  const response = await handler.GET!(request, {} as never);

  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("content-type"),
    "application/json; charset=utf-8",
  );
  assertEquals(response.headers.get("cache-control"), "no-store");
  assertEquals(await response.json(), {
    ok: true,
    service: SERVICE_INFO.name,
    version: SERVICE_INFO.version,
  });
});
