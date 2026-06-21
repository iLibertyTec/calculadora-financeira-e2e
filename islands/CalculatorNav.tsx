type PlannedCalculator = {
  title: string;
  href: string;
  status: string;
};

type CalculatorNavProps = {
  items: PlannedCalculator[];
};

export default function CalculatorNav(props: CalculatorNavProps) {
  return (
    <nav aria-label="Visão rápida das calculadoras planejadas">
      <ul class="calculator-nav">
        {props.items.map((item: PlannedCalculator) => (
          <li key={item.href} class="calculator-nav__item">
            <span class="calculator-nav__link" role="text">
              <span class="calculator-nav__title">{item.title}</span>
              <span class="calculator-nav__status">{item.status}</span>
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
