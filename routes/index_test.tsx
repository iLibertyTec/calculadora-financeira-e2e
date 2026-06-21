import { assertStringIncludes } from "@std/assert";
import { renderToString } from "preact-render-to-string";
import AppChrome from "../components/AppChrome.tsx";
import Home from "./index.tsx";

Deno.test("Home integra com AppChrome em SSR", () => {
  const html: string = renderToString(
    <AppChrome>
      <Home />
    </AppChrome>,
  );

  assertStringIncludes(html, "Bem-vindo");
  assertStringIncludes(html, 'aria-labelledby="home-heading"');
  assertStringIncludes(html, "Calculadora Financeira");
});
