import AppChrome from "../components/AppChrome.tsx";
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
    <AppChrome>
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

        .calculator-nav__intro {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
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
            Simulações financeiras com base sólida para as próximas etapas.
          </h2>
          <p class="home-text">
            Esta home apresenta a direção do produto e já deixa pronta a
            estrutura de navegação para futuras calculadoras interativas.
          </p>
          <div class="home-actions">
            <a class="home-link" href="#calculadoras-planejadas">
              Ver calculadoras planejadas
            </a>
            <a class="home-button" href="#proximos-passos">
              Entender roadmap inicial
            </a>
          </div>
        </section>

        <section
          class="home-section"
          aria-labelledby="calculadoras-planejadas-title"
          id="calculadoras-planejadas"
        >
          <h2 class="home-heading" id="calculadoras-planejadas-title">
            Navegação planejada
          </h2>
          <p class="home-text">
            A lista abaixo organiza os acessos previstos para o produto e serve
            como base segura para evoluções client-side futuras.
          </p>
          <CalculatorNav items={plannedCalculators} />
        </section>

        <section class="home-section" aria-labelledby="recursos-title">
          <h2 class="home-heading" id="recursos-title">
            Calculadoras priorizadas
          </h2>
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
          aria-labelledby="proximos-passos-title"
          id="proximos-passos"
        >
          <h2 class="home-heading" id="proximos-passos-title">
            Próximos passos
          </h2>
          <p class="home-note">
            Entregas iniciais previstas: simulador de financiamento, projeção de
            juros compostos e comparação de cenários com foco em clareza,
            acessibilidade e evolução incremental.
          </p>
          <ul class="home-list">
            <li>Publicar a primeira calculadora com validações simples.</li>
            <li>Adicionar resultados interpretáveis e compartilháveis.</li>
            <li>Expandir a navegação planejada conforme novas rotas surgirem.</li>
          </ul>
        </section>
      </div>
    </AppChrome>
  );
}
