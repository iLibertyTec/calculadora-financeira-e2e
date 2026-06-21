import { ComponentChildren } from "preact";

type AppChromeProps = {
  children: ComponentChildren;
};

export default function AppChrome(props: AppChromeProps) {
  return (
    <div class="app-shell">
      <header class="site-header">
        <div class="container">
          <p class="site-eyebrow">Calculadora Financeira</p>
          <h1 class="site-title">Simule cenários financeiros com clareza</h1>
          <p class="site-description">
            Ferramenta para apoiar análises, comparações e decisões com uma
            experiência simples e responsiva.
          </p>
        </div>
      </header>
      <main class="site-main">
        <div class="container">{props.children}</div>
      </main>
      <footer class="site-footer">
        <div class="container">
          <p>© Calculadora Financeira · Interface base pronta para evolução.</p>
        </div>
      </footer>
    </div>
  );
}
