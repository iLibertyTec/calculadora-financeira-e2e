import { JSX } from "preact";

export const config = {
  title: "Início",
};

export default function Home(): JSX.Element {
  return (
    <section aria-labelledby="pagina-inicial-titulo">
      <h1 id="pagina-inicial-titulo">
        Planeje simulações financeiras com segurança
      </h1>
      <p>
        Esta base em Fresh já oferece estrutura compartilhada, semântica em
        português do Brasil e comportamento responsivo para evoluir a
        aplicação.
      </p>
      <p>
        A próxima etapa pode incluir formulários, comparações de cenários e
        visualizações de resultados sem depender de APIs do navegador no SSR.
      </p>
    </section>
  );
}
