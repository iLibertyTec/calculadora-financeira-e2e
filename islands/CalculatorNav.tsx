export type PlannedCalculatorNavItem = {
  title: string;
  href: string;
  status: string;
};

type CalculatorNavProps = {
  items: PlannedCalculatorNavItem[];
};

export default function CalculatorNav(props: CalculatorNavProps) {
  return (
    <nav aria-label="Calculadoras planejadas">
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
