import { assert, assertEquals } from "@std/assert";
import { APP_VERSION, SERVICE_NAME } from "../src/app_info.ts";
import { handler } from "./health.ts";

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

Deno.test("GET /health retorna contrato público esperado", async () => {
  const response = await requestHealth("GET");

  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("content-type"),
    "application/json; charset=utf-8",
  );
  assertEquals(response.headers.get("cache-control"), "no-store");

  const body: unknown = await response.json();

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

Deno.test("GET /health é estável e independe de ambiente", async () => {
  const response = await requestHealth("GET");
  const body: unknown = await response.json();

  assertEquals(body, {
    ok: true,
    service: "ifactory-product",
    version: "0.1.0",
  });
  assertEquals(SERVICE_NAME, "ifactory-product");
  assertEquals(APP_VERSION, "0.1.0");
});
