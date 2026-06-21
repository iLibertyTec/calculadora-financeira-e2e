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
    status: "Planejada",
  },
  {
    title: "Juros compostos",
    description:
      "Projete crescimento de patrimônio com aportes recorrentes, taxa mensal e horizonte de investimento.",
    href: "/calculadoras/juros-compostos",
    status: "Planejada",
  },
  {
    title: "Comparação de cenários",
    description:
      "Compare alternativas lado a lado para entender impacto de taxas, prazos e estratégias financeiras.",
    href: "/calculadoras/comparacao-de-cenarios",
    status: "Planejada",
  },
];

export default function HomePage() {
  return (
    <>
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
          font-size: clamp(1.5rem, 3vw, 2rem);
          line-height: 1.15;
        }

        .home-heading--primary {
          font-size: clamp(1.9rem, 4vw, 2.75rem);
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

        .home-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .home-link,
        .home-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 2.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.85rem;
          font-weight: 700;
          text-decoration: none;
        }

        .home-link {
          background: var(--accent-strong);
          color: white;
        }

        .home-button {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          color: var(--muted);
          cursor: not-allowed;
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

        .home-card__hint {
          margin: 0;
          color: var(--muted);
          font-size: 0.95rem;
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

      <div class="home">
        <section class="home-hero" aria-labelledby="apresentacao-title">
          <p class="home-kicker">Versão inicial do produto</p>
          <h2 class="home-heading home-heading--primary" id="apresentacao-title">
            Simule decisões financeiras com mais clareza
          </h2>
          <p class="home-text">
            Esta é a página inicial da Calculadora Financeira, uma base para
            reunir ferramentas de simulação e análise em português do Brasil.
          </p>
          <p class="home-text">
            Nesta primeira versão, você pode conhecer a proposta do produto e
            navegar pela estrutura das calculadoras que serão disponibilizadas
            nas próximas etapas.
          </p>
          <div class="home-actions">
            <a class="home-link" href="#calculadoras-title">
              Ver calculadoras planejadas
            </a>
          </div>
        </section>

        <section class="home-section" aria-labelledby="calculadoras-title">
          <h2 class="home-heading" id="calculadoras-title">
            Calculadoras planejadas
          </h2>
          <p class="home-text">
            O produto foi pensado para apoiar análises práticas e comparações
            rápidas antes de financiar, investir ou revisar alternativas.
          </p>
          <div class="home-grid">
            {featureCards.map((feature: FeatureCard) => (
              <article class="home-card" key={feature.href}>
                <div class="home-card__header">
                  <h3 class="home-card__title">{feature.title}</h3>
                  <span class="home-card__badge">{feature.status}</span>
                </div>
                <p class="home-card__description">{feature.description}</p>
                <p class="home-card__hint">
                  Rota planejada: <code>{feature.href}</code>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section class="home-section" aria-labelledby="proximo-passo-title">
          <h2 class="home-heading" id="proximo-passo-title">
            Próximo passo
          </h2>
          <p class="home-note">
            Esta versão inicial apresenta a visão do produto e a navegação das
            funcionalidades futuras sem depender de JavaScript no cliente para a
            renderização da página.
          </p>
        </section>
      </div>
    </>
  );
}
