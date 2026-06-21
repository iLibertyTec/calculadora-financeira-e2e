import { type ComponentChildren } from "preact";
import { PRODUCT_NAME } from "../src/app_info.ts";

type AppChromeProps = {
  children: ComponentChildren;
};

export default function AppChrome(props: AppChromeProps) {
  return (
    <div class="app-shell">
      <a class="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <header class="app-header">
        <div class="app-header__inner">
          <p class="app-eyebrow">Calculadora financeira</p>
          <p class="app-title">{PRODUCT_NAME}</p>
          <p class="app-subtitle">
            Simulações e análises com uma experiência simples, responsiva e
            acessível.
          </p>
        </div>
      </header>
      <main class="app-main" id="conteudo-principal">
        <div class="app-main__inner">{props.children}</div>
      </main>
      <footer class="app-footer">
        <div class="app-footer__inner">
          <small>© 2025 {PRODUCT_NAME}</small>
        </div>
      </footer>
    </div>
  );
}
