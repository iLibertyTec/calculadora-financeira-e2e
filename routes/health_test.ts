import { assertEquals } from "@std/assert";
import { handler } from "./health.ts";

deno.test("GET /health retorna contrato esperado", () => {
  const response = handler.GET!(new Request("http://localhost/health"), {} as never);

  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("content-type"),
    "application/json; charset=utf-8",
  );

  return response.json().then((body: unknown) => {
    assertEquals(body, {
      ok: true,
      service: "ifactory-product",
      version: "0.1.0",
    });
  });
});
