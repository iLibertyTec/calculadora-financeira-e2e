import { assert, assertEquals } from "@std/assert";
import { APP_VERSION, SERVICE_NAME } from "../src/app_info.ts";
import { handler } from "./health.ts";

Deno.test("GET /health retorna contrato esperado", async () => {
  const response = handler.GET!(
    new Request("http://localhost/health"),
    {} as never,
  );

  assertEquals(response.status, 200);
  assert(response.headers.get("content-type")?.includes("application/json"));

  const body: unknown = await response.json();

  assertEquals(body, {
    ok: true,
    service: SERVICE_NAME,
    version: APP_VERSION,
  });
});
