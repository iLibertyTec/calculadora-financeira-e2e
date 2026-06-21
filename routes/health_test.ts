import { assert, assertEquals } from "@std/assert";
import { APP_VERSION, SERVICE_NAME } from "../src/app_info.ts";
import { handler } from "./health.ts";

Deno.test("rota /health exporta handler GET e retorna contrato esperado", async () => {
  assert(handler.GET);

  const response = await handler.GET!(
    new Request("http://localhost/health", { method: "GET" }),
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

Deno.test("rota /health responde sem depender de layout global", async () => {
  const response = await handler.GET!(
    new Request("http://localhost/health", { method: "GET" }),
    {} as never,
  );

  assertEquals(
    response.headers.get("content-type"),
    "application/json; charset=utf-8",
  );
});
