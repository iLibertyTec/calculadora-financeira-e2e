import { type PageProps } from "$fresh/server.ts";
import AppChrome from "../components/AppChrome.tsx";
import { PRODUCT_NAME } from "../src/app_info.ts";

export default function App(props: PageProps) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{PRODUCT_NAME}</title>
        <meta
          name="description"
          content="Calculadora financeira com interface responsiva e acessível."
        />
        <style>{`
          :root {
            color-scheme: dark;
            --bg: #0b1020;
            --bg-soft: #111831;
            --surface: rgba(17, 24, 49, 0.82);
            --surface-strong: #162041;
            --border: rgba(255, 255, 255, 0.12);
            --text: #eef2ff;
            --muted: #b8c0e0;
            --accent: #7aa2ff;
            --accent-strong: #4f7dff;
            --shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            min-height: 100%;
            background:
              radial-gradient(circle at top, rgba(122, 162, 255, 0.16), transparent 35%),
              linear-gradient(180deg, #09101f 0%, var(--bg) 100%);
            color: var(--text);
          }

          body {
            min-height: 100vh;
          }

          a {
            color: inherit;
          }

          .skip-link {
            position: absolute;
            top: 1rem;
            left: 1rem;
            transform: translateY(-200%);
            background: var(--accent-strong);
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            z-index: 10;
            text-decoration: none;
          }

          .skip-link:focus {
            transform: translateY(0);
          }

          .app-shell {
            min-height: 100vh;
            display: grid;
            grid-template-rows: auto 1fr auto;
          }

          .app-header,
          .app-main,
          .app-footer {
            width: 100%;
          }

          .app-header__inner,
          .app-main__inner,
          .app-footer__inner {
            width: min(100%, 72rem);
            margin: 0 auto;
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .app-header {
            padding-top: 2.5rem;
            padding-bottom: 1.5rem;
          }

          .app-header__inner {
            padding-top: 1.5rem;
          }

          .app-eyebrow {
            margin: 0 0 0.75rem;
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-size: 0.8rem;
            font-weight: 700;
          }

          .app-title {
            margin: 0;
            font-size: clamp(2rem, 4vw, 3.25rem);
            line-height: 1.1;
          }

          .app-subtitle {
            margin: 1rem 0 0;
            max-width: 42rem;
            color: var(--muted);
            font-size: 1rem;
            line-height: 1.7;
          }

          .app-main {
            padding-bottom: 2rem;
          }

          .app-main__inner {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 1.5rem;
            box-shadow: var(--shadow);
            backdrop-filter: blur(14px);
            padding-top: 1.5rem;
            padding-bottom: 1.5rem;
          }

          .app-footer {
            padding-top: 1.5rem;
            padding-bottom: 2rem;
          }

          .app-footer__inner {
            color: var(--muted);
            font-size: 0.9rem;
          }

          @media (min-width: 768px) {
            .app-header {
              padding-top: 4rem;
              padding-bottom: 2rem;
            }

            .app-header__inner,
            .app-main__inner,
            .app-footer__inner {
              padding-left: 2rem;
              padding-right: 2rem;
            }

            .app-main__inner {
              padding-top: 2rem;
              padding-bottom: 2rem;
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
