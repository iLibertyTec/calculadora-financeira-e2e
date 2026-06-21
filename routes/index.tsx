type FeatureCard = {
  title: string;
  description: string;
  href: string;
  status: string;
};

const featureCards: FeatureCard[] = [
  {
    title: "Financiamento",
    description:
      "Planeje parcelas, entrada, prazo e custo total para avaliar diferentes opções de crédito.",
    href: "/calculadoras/financiamento",
    status: "Em breve",
  },
  {
    title: "Juros compostos",
    description:
      "Projete crescimento de patrimônio com aportes recorrentes, taxa mensal e horizonte de investimento.",
    href: "/calculadoras/juros-compostos",
    status: "Em breve",
  },
  {
    title: "Comparação de cenários",
    description:
      "Compare alternativas lado a lado para entender impacto de taxas, prazos e estratégias financeiras.",
    href: "/calculadoras/comparacao-de-cenarios",
    status: "Em breve",
  },
];

export default function HomePage() {
  return (
    <section class="home">
      <style>{`
        .home {
          display: grid;
          gap: 2rem;
        }

        .home-hero,
        .home-section {
          display: grid;
          gap: 1rem;
        }

        .home-kicker {
          margin: 0;
          color: var(--accent);
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .home-heading {
          margin: 0;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          line-height: 1.15;
        }

        .home-text,
        .home-list {
          margin: 0;
          color: var(--muted);
          line-height: 1.7;
        }

        .home-list {
          padding-left: 1.25rem;
        }

        .home-grid {
          display: grid;
          gap: 1rem;
        }

        .home-card {
          display: grid;
          gap: 0.75rem;
          padding: 1.25rem;
          border-radius: 1rem;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
        }

        .home-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .home-card__title {
          margin: 0;
          font-size: 1.1rem;
        }

        .home-card__badge {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.65rem;
          border-radius: 999px;
          background: rgba(122, 162, 255, 0.14);
          color: var(--accent);
          font-size: 0.8rem;
          font-weight: 700;
        }

        .home-card__description {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .home-card__link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text);
          font-weight: 700;
          text-decoration: none;
        }

        .home-card__link:hover,
        .home-card__link:focus-visible {
          color: var(--accent);
        }

        .home-note {
          margin: 0;
          padding: 1rem 1.25rem;
          border-left: 4px solid var(--accent-strong);
          border-radius: 0.75rem;
          background: rgba(79, 125, 255, 0.08);
          color: var(--muted);
        }

        @media (min-width: 768px) {
          .home-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>

      <section class="home-hero" aria-labelledby="apresentacao-title">
        <p class="home-kicker">Planejamento financeiro em pt-BR</p>
        <h2 class="home-heading" id="apresentacao-title">
          Bem-vindo à Calculadora Financeira
        </h2>
        <p class="home-text">
          Esta página inicial apresenta a visão do produto e organiza o acesso
          às calculadoras planejadas para apoiar decisões do dia a dia com mais
          clareza.
        </p>
        <p class="home-text">
          A proposta é oferecer ferramentas objetivas para simular cenários,
          entender custos ao longo do tempo e comparar alternativas antes de
          contratar, investir ou renegociar.
        </p>
      </section>

      <section class="home-section" aria-labelledby="calculadoras-title">
        <h2 class="home-heading" id="calculadoras-title">
          Calculadoras planejadas
        </h2>
        <p class="home-text">
          O roadmap inicial contempla módulos focados em análises práticas para
          pessoas que precisam tomar decisões financeiras com mais confiança.
        </p>
        <ul class="home-list">
          <li>
            <strong>Financiamento:</strong> simulação de parcelas, entrada,
            juros e custo total.
          </li>
          <li>
            <strong>Juros compostos:</strong> projeções de crescimento com
            aportes e rentabilidade recorrente.
          </li>
          <li>
            <strong>Comparação de cenários:</strong> avaliação lado a lado entre
            opções de prazo, taxa e estratégia.
          </li>
        </ul>
      </section>

      <section class="home-section" aria-labelledby="navegacao-title">
        <h2 class="home-heading" id="navegacao-title">
          Navegação para funcionalidades futuras
        </h2>
        <div class="home-grid">
          {featureCards.map((feature: FeatureCard) => (
            <article class="home-card" key={feature.href}>
              <div class="home-card__header">
                <h3 class="home-card__title">{feature.title}</h3>
                <span class="home-card__badge">{feature.status}</span>
              </div>
              <p class="home-card__description">{feature.description}</p>
              <a class="home-card__link" href={feature.href}>
                Conhecer esta funcionalidade
              </a>
            </article>
          ))}
        </div>
        <p class="home-note">
          As rotas acima já sinalizam a estrutura futura do produto e permitem
          evoluir a navegação sem depender de JavaScript no cliente.
        </p>
      </section>
    </section>
  );
}
