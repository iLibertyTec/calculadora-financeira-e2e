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
    status: "Em construção",
  },
  {
    title: "Juros compostos",
    description:
      "Projete crescimento de patrimônio com aportes recorrentes, taxa mensal e horizonte de investimento.",
    href: "/calculadoras/juros-compostos",
    status: "Em construção",
  },
  {
    title: "Comparação de cenários",
    description:
      "Compare alternativas lado a lado para entender impacto de taxas, prazos e estratégias financeiras.",
    href: "/calculadoras/comparacao-de-cenarios",
    status: "Em construção",
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
        }

        .home-grid {
          display: grid;
          gap: 1rem;
          padding: 0;
          margin: 0;
          list-style: none;
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

      <main class="home" id="conteudo-principal">
        <section class="home-hero" aria-labelledby="apresentacao-title">
          <p class="home-kicker">Versão inicial do produto</p>
          <h1 class="home-heading home-heading--primary" id="apresentacao-title">
            Calculadora Financeira para simular decisões com mais clareza
          </h1>
          <p class="home-text">
            Esta é a página inicial da Calculadora Financeira, uma base para
            reunir ferramentas de simulação e análise em português do Brasil.
          </p>
          <p class="home-text">
            Nesta primeira versão, você pode conhecer a proposta do produto e
            visualizar quais calculadoras estão planejadas para as próximas
            entregas.
          </p>
          <div class="home-actions">
            <a class="home-link" href="#calculadoras-title">
              Conhecer calculadoras planejadas
            </a>
          </div>
          <p class="home-note">
            As rotas das calculadoras ainda não estão disponíveis nesta etapa.
            Esta home apresenta a visão inicial do produto e indica o que está
            em construção para evitar navegação para páginas inexistentes.
          </p>
        </section>

        <section class="home-section" aria-labelledby="calculadoras-title">
          <h2 class="home-heading" id="calculadoras-title">
            Calculadoras planejadas
          </h2>
          <p class="home-text">
            O produto foi pensado para apoiar análises práticas e comparações
            rápidas antes de financiar, investir ou revisar alternativas.
          </p>
          <ul class="home-grid">
            {featureCards.map((feature: FeatureCard) => (
              <li key={feature.href}>
                <article class="home-card">
                  <div class="home-card__header">
                    <h3 class="home-card__title">{feature.title}</h3>
                    <span class="home-card__badge">{feature.status}</span>
                  </div>
                  <p class="home-card__description">{feature.description}</p>
                  <p class="home-card__hint">
                    Rota planejada: <code>{feature.href}</code>
                  </p>
                  <p class="home-card__hint">
                    Disponibilidade atual: funcionalidade ainda indisponível.
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section class="home-section" aria-labelledby="proximos-passos-title">
          <h2 class="home-heading" id="proximos-passos-title">
            Próximos passos do produto
          </h2>
          <p class="home-text">
            As próximas entregas devem transformar essas áreas em calculadoras
            utilizáveis, com formulários, resultados detalhados e comparação de
            cenários sem exigir JavaScript obrigatório para acessar o conteúdo
            principal.
          </p>
          <ul class="home-list">
            <li>Simulação de financiamento com parcelas e custo total.</li>
            <li>Projeção de juros compostos com aportes recorrentes.</li>
            <li>Comparação entre cenários financeiros lado a lado.</li>
          </ul>
        </section>
      </main>
    </>
  );
}
