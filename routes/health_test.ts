import { assert, assertEquals } from "@std/assert";
import { APP_VERSION, SERVICE_NAME } from "../src/app_info.ts";
import { createHealthPayload, handler } from "./health.ts";

async function requestHealth(method = "GET"): Promise<Response> {
  const routeHandler = handler[method as keyof typeof handler];

  if (typeof routeHandler !== "function") {
    throw new Error(`Método ${method} não suportado pela rota /health`);
  }

  return await routeHandler(
    new Request("http://localhost/health", { method }),
    {} as never,
  );
}

Deno.test("createHealthPayload monta payload de forma isolada", () => {
  assertEquals(createHealthPayload("svc", "1.2.3"), {
    ok: true,
    service: "svc",
    version: "1.2.3",
  });
});

Deno.test("GET /health retorna contrato público esperado", async () => {
  const response = await requestHealth("GET");

  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("content-type"),
    "application/json; charset=utf-8",
  );
  assertEquals(response.headers.get("cache-control"), "no-store");

  const body = await response.json() as Record<string, unknown>;

  assertEquals(Object.keys(body).sort(), ["ok", "service", "version"]);
  assertEquals(body, {
    ok: true,
    service: SERVICE_NAME,
    version: APP_VERSION,
  });
});

Deno.test("/health expõe apenas GET no contrato da rota", () => {
  assert(typeof handler.GET === "function");
  assertEquals("POST" in handler, false);
  assertEquals("PUT" in handler, false);
  assertEquals("DELETE" in handler, false);
});
