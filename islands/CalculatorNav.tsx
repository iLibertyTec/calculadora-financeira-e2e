export type PlannedCalculatorStatus = "Em construção" | "Planejada";

export type PlannedCalculatorNavItem = {
  title: string;
  href: string;
  status: PlannedCalculatorStatus;
};

type CalculatorNavProps = {
  items: PlannedCalculatorNavItem[];
};

export default function CalculatorNav(props: CalculatorNavProps) {
  return (
    <nav aria-label="Calculadoras planejadas">
      <p class="calculator-nav__intro">
        A navegação abaixo antecipa as próximas calculadoras do produto. Os
        links continuam acessíveis mesmo sem JavaScript.
      </p>
      <ul class="calculator-nav">
        {props.items.map((item: PlannedCalculatorNavItem) => (
          <li key={item.href} class="calculator-nav__item">
            <a class="calculator-nav__link" href={item.href}>
              <span class="calculator-nav__title">{item.title}</span>
              <span class="calculator-nav__status">{item.status}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
