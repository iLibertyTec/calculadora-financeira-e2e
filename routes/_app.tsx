import { type PageProps } from "$fresh/server.ts";
import AppChrome from "../components/AppChrome.tsx";
import { PRODUCT_NAME } from "../src/app_info.ts";

export default function App(props: PageProps) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>{PRODUCT_NAME} | Planejamento financeiro em pt-BR</title>
        <meta
          name="description"
          content="Calculadora Financeira com visão inicial das calculadoras planejadas de financiamento, juros compostos e comparação de cenários."
        />
        <style>{`
          :root {
            color-scheme: dark;
            --bg: #080b17;
            --panel: #141b34;
            --text: #eaeefa;
            --muted: #a7b1d1;
            --accent: #7aa2ff;
            --accent-strong: #4c8dff;
            --border: rgba(255, 255, 255, 0.12);
          }

          * {
            box-sizing: border-box;
          }

          html {
            font-family: system-ui, sans-serif;
            background: var(--bg);
            color: var(--text);
          }

          body {
            margin: 0;
            min-height: 100vh;
            background:
              radial-gradient(circle at top, rgba(76, 141, 255, 0.18), transparent 30%),
              var(--bg);
            color: var(--text);
          }

          a {
            color: inherit;
          }

          .skip-link {
            position: absolute;
            left: 1rem;
            top: -3rem;
            z-index: 10;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            background: var(--accent-strong);
            color: white;
            text-decoration: none;
            transition: top 0.2s ease;
          }

          .skip-link:focus {
            top: 1rem;
          }

          .app-shell {
            min-height: 100vh;
          }

          .app-header,
          .app-main,
          .app-footer {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }

          .app-header__inner,
          .app-main__inner,
          .app-footer__inner {
            width: min(100%, 72rem);
            margin: 0 auto;
          }

          .app-header {
            padding-top: 3rem;
            padding-bottom: 1.5rem;
          }

          .app-header__inner {
            display: grid;
            gap: 0.75rem;
          }

          .app-eyebrow {
            margin: 0;
            color: var(--accent);
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            font-size: 0.85rem;
          }

          .app-title {
            margin: 0;
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 800;
            line-height: 1.1;
          }

          .app-subtitle {
            margin: 0;
            max-width: 42rem;
            color: var(--muted);
            line-height: 1.7;
          }

          .app-main {
            padding-bottom: 3rem;
          }

          .app-main__inner {
            padding: 1.5rem;
            border: 1px solid var(--border);
            border-radius: 1.5rem;
            background: rgba(20, 27, 52, 0.72);
            backdrop-filter: blur(10px);
          }

          .app-footer {
            padding-top: 0;
            padding-bottom: 2rem;
          }

          .app-footer__inner {
            color: var(--muted);
          }

          @media (min-width: 768px) {
            .app-header {
              padding-top: 4rem;
              padding-bottom: 2rem;
            }

            .app-main__inner {
              padding: 2rem;
            }
          }
        `}</style>
      </head>
      <body>
        <AppChrome>
          <props.Component />
        </AppChrome>
      </body>
    </html>
  );
}
