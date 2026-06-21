import type { PageProps } from "$fresh/server.ts";
import AppChrome from "../components/AppChrome.tsx";

const GLOBAL_STYLES: string = `
  :root {
    color-scheme: light;
    --color-background: #f5f7fb;
    --color-surface: #ffffff;
    --color-text: #102033;
    --color-muted: #526277;
    --color-primary: #0f62fe;
    --color-primary-strong: #0b4ecc;
    --color-border: #d9e2ec;
    --color-focus: #ffbf47;
    --shadow-soft: 0 12px 32px rgba(16, 32, 51, 0.08);
    --radius-lg: 24px;
    --radius-md: 16px;
    --space-1: 0.5rem;
    --space-2: 1rem;
    --space-3: 1.5rem;
    --space-4: 2rem;
    --space-5: 3rem;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    overflow-x: hidden;
  }

  body {
    margin: 0;
    min-height: 100vh;
    overflow-x: hidden;
    background: linear-gradient(180deg, #eef4ff 0%, var(--color-background) 100%);
    color: var(--color-text);
  }

  a {
    color: var(--color-primary);
  }

  a:hover {
    color: var(--color-primary-strong);
  }

  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 3px;
    border-radius: 0.375rem;
  }

  img {
    max-width: 100%;
    display: block;
  }

  .app-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .skip-link {
    position: fixed;
    top: 0.5rem;
    left: 0.5rem;
    transform: translateY(-140%);
    padding: 0.75rem 1rem;
    background: var(--color-text);
    color: var(--color-surface);
    text-decoration: none;
    border-radius: 0.75rem;
    box-shadow: var(--shadow-soft);
    z-index: 100;
  }

  .skip-link:focus,
  .skip-link:focus-visible {
    transform: translateY(0);
  }

  .container {
    width: min(100% - 1.5rem, 72rem);
    margin: 0 auto;
  }

  .site-header {
    padding: var(--space-4) 0 var(--space-3);
  }

  .site-header .container,
  .site-main .container,
  .site-footer .container {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-soft);
  }

  .site-header .container {
    padding: var(--space-4);
  }

  .site-eyebrow {
    margin: 0 0 var(--space-1);
    color: var(--color-primary);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.8rem;
  }

  .site-title {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.5rem);
    line-height: 1.1;
    font-weight: 700;
  }

  .site-description {
    margin: var(--space-2) 0 0;
    max-width: 40rem;
    color: var(--color-muted);
    font-size: 1.05rem;
    line-height: 1.6;
  }

  .site-main {
    flex: 1;
    padding-bottom: var(--space-3);
  }

  .site-main .container {
    padding: var(--space-4);
    min-width: 0;
  }

  .site-main > .container > * {
    max-width: 100%;
  }

  .site-main :where(h1, h2, h3) {
    line-height: 1.2;
    overflow-wrap: anywhere;
  }

  .site-main :where(p, li, dd, dt) {
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  .site-footer {
    padding: 0 0 var(--space-3);
  }

  .site-footer .container {
    padding: var(--space-3) var(--space-4);
    text-align: center;
    color: var(--color-muted);
    line-height: 1.5;
  }

  .site-footer .container > *:first-child {
    margin-top: 0;
  }

  .site-footer .container > *:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 640px) {
    .container {
      width: min(100% - 1rem, 72rem);
    }

    .site-header {
      padding-top: var(--space-3);
      padding-bottom: var(--space-2);
    }

    .site-header .container,
    .site-main .container,
    .site-footer .container {
      border-radius: var(--radius-md);
      padding-left: var(--space-3);
      padding-right: var(--space-3);
    }

    .site-header .container,
    .site-main .container {
      padding-top: var(--space-3);
      padding-bottom: var(--space-3);
    }

    .site-footer .container {
      padding-top: var(--space-2);
      padding-bottom: var(--space-2);
    }

    .site-description,
    .site-footer .container {
      font-size: 0.98rem;
    }
  }

  @media (max-width: 480px) {
    .container {
      width: min(100% - 0.75rem, 72rem);
    }

    .skip-link {
      left: 0.375rem;
      right: 0.375rem;
      width: auto;
      text-align: center;
    }

    .site-header {
      padding-top: var(--space-2);
    }

    .site-eyebrow {
      font-size: 0.72rem;
    }

    .site-title {
      font-size: clamp(1.6rem, 8vw, 2.2rem);
    }

    .site-description,
    .site-main,
    .site-footer .container {
      font-size: 0.95rem;
    }

    .site-header .container,
    .site-main .container,
    .site-footer .container {
      padding-left: var(--space-2);
      padding-right: var(--space-2);
    }
  }
`;

export default function App(props: PageProps): JSX.Element {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Calculadora Financeira</title>
        <style>{GLOBAL_STYLES}</style>
      </head>
      <body>
        <AppChrome>
          <props.Component {...props} />
        </AppChrome>
      </body>
    </html>
  );
}
