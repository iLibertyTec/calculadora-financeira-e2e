import { ComponentChildren, JSX } from "preact";

type AppChromeProps = {
  children: ComponentChildren;
  title?: ComponentChildren;
  description?: ComponentChildren;
  footer?: ComponentChildren;
};

const DEFAULT_TITLE: ComponentChildren =
  "Simule cenários financeiros com clareza";
const DEFAULT_DESCRIPTION: ComponentChildren = (
  <>
    Ferramenta para apoiar análises, comparações e decisões com uma experiência
    simples e responsiva.
  </>
);
const DEFAULT_FOOTER: ComponentChildren = (
  <small>© Calculadora Financeira · Interface base pronta para evolução.</small>
);

export default function AppChrome(props: AppChromeProps): JSX.Element {
  return (
    <div class="app-shell">
      <a class="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <header class="site-header">
        <div class="container">
          <p class="site-eyebrow">Calculadora Financeira</p>
          <p class="site-title" role="heading" aria-level={1}>
            {props.title ?? DEFAULT_TITLE}
          </p>
          <p class="site-description">
            {props.description ?? DEFAULT_DESCRIPTION}
          </p>
        </div>
      </header>
      <main class="site-main" id="conteudo-principal">
        <div class="container">{props.children}</div>
      </main>
      <footer class="site-footer">
        <div class="container">{props.footer ?? DEFAULT_FOOTER}</div>
      </footer>
    </div>
  );
}
