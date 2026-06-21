import type { ComponentChildren } from "preact";

interface AppProps {
  Component: () => ComponentChildren;
}

export default function App({ Component }: AppProps): ComponentChildren {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>iFactory Product</title>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
