import { assertEquals } from "@std/assert";

import { APP_VERSION, PRODUCT_NAME, SERVICE_NAME } from "./app_info.ts";

deno.test("app info exports metadata used by health contract", () => {
  assertEquals(SERVICE_NAME, "ifactory-product");
  assertEquals(APP_VERSION, "0.1.0");
  assertEquals(PRODUCT_NAME, "iFactory Product");
});
