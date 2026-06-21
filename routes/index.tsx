import CalculatorNav, {
  type PlannedCalculatorNavItem,
} from "../islands/CalculatorNav.tsx";

type PlannedCalculator = PlannedCalculatorNavItem & {
  description: string;
};

const plannedCalculators: PlannedCalculator[] = [
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

        .calculator-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .calculator-nav__search {
          display: grid;
          gap: 0.5rem;
          max-width: 24rem;
        }

        .calculator-nav__search-label {
          font-weight: 700;
          color: var(--ink);
        }

        .calculator-nav__search-input {
          min-height: 2.75rem;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: 0.85rem;
          background: rgba(255, 255, 255, 0.03);
          color: var(--ink);
        }

        .calculator-nav__item {
          display: flex;
        }

        .calculator-nav__link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          min-height: 2.75rem;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.03);
          color: var(--ink);
          text-decoration: none;
        }

        .calculator-nav__link:hover,
        .calculator-nav__link:focus-visible {
          border-color: rgba(122, 162, 255, 0.45);
          background: rgba(79, 125, 255, 0.08);
          outline: none;
        }

        .calculator-nav__title {
          font-weight: 700;
        }

        .calculator-nav__status {
          color: var(--muted);
          font-size: 0.85rem;
        }

        .calculator-nav__empty {
          margin: 0;
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
            <a class="home-link" href="#calculadoras-planejadas">
              Ver calculadoras planejadas
            </a>
            <a class="home-button" href="#proximos-passos">
              Entender próximos passos
            </a>
          </div>
        </section>

        <section class="home-section" aria-labelledby="visao-title">
          <h2 class="home-heading" id="visao-title">Visão desta base inicial</h2>
          <p class="home-text">
            O produto está sendo preparado para receber calculadoras financeiras
            específicas de forma incremental, com foco em experiência simples,
            acessível e evolutiva.
          </p>
          <ul class="home-list">
            <li>Navegação clara entre ferramentas planejadas.</li>
            <li>Estrutura pronta para interatividade futura com islands.</li>
            <li>Base adequada para expandir simulações sem refazer a home.</li>
          </ul>
        </section>

        <section
          class="home-section"
          id="calculadoras-planejadas"
          aria-labelledby="calculadoras-planejadas-title"
        >
          <h2 class="home-heading" id="calculadoras-planejadas-title">
            Calculadoras planejadas
          </h2>
          <p class="home-text">
            Use a navegação abaixo para destacar rapidamente as ferramentas já
            mapeadas no roadmap. Sem JavaScript, os links continuam funcionando
            normalmente.
          </p>
          <CalculatorNav items={plannedCalculators} />
          <ul class="home-grid">
            {plannedCalculators.map((calculator: PlannedCalculator) => (
              <li key={calculator.href} class="home-card">
                <div class="home-card__header">
                  <h3 class="home-card__title">{calculator.title}</h3>
                  <span class="home-card__badge">{calculator.status}</span>
                </div>
                <p class="home-card__description">{calculator.description}</p>
                <p class="home-card__hint">Rota planejada: {calculator.href}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          class="home-section"
          id="proximos-passos"
          aria-labelledby="proximos-passos-title"
        >
          <h2 class="home-heading" id="proximos-passos-title">
            Próximos passos do roadmap
          </h2>
          <p class="home-note">
            As próximas entregas devem transformar estas entradas planejadas em
            calculadoras funcionais, mantendo a navegação consistente e
            progressive enhancement como padrão.
          </p>
        </section>
      </main>
    </>
  );
}
