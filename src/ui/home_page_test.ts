import { assertStringIncludes } from "@std/assert";
import { renderHomePage } from "./home_page.ts";

deno.test("renderHomePage contains visit counter main elements", (): void => {
  const html = renderHomePage();

  assertStringIncludes(html, "<h1>Visit Analytics</h1>");
  assertStringIncludes(html, '<div id="count">0</div>');
  assertStringIncludes(html, '<p id="msg"></p>');
  assertStringIncludes(html, '<button id="btn">Registrar visita</button>');
  assertStringIncludes(html, "fetch('/api/visits')");
});
