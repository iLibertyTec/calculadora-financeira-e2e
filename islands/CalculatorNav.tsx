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
    <nav aria-label="Navegação das calculadoras planejadas">
      <ul class="calculator-nav">
        {props.items.map((item: PlannedCalculator) => (
          <li key={item.href} class="calculator-nav__item">
            <a class="calculator-nav__link" href={item.href} aria-disabled="true">
              <span class="calculator-nav__title">{item.title}</span>
              <span class="calculator-nav__status">{item.status}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
