import { assertStringIncludes } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import AppChrome from "./AppChrome.tsx";

Deno.test("AppChrome renderiza estrutura básica do layout", () => {
  const html: string = renderToString(
    <AppChrome>
      <section>
        <h2>Conteúdo</h2>
        <p>Área principal.</p>
      </section>
    </AppChrome>,
  );

  assertStringIncludes(html, "<header");
  assertStringIncludes(html, "<main");
  assertStringIncludes(html, "<footer");
  assertStringIncludes(html, "Conteúdo");
});
