import { useMemo, useState } from "preact/hooks";

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
  const [query, setQuery] = useState<string>("");

  const filteredItems: PlannedCalculatorNavItem[] = useMemo(() => {
    const normalizedQuery: string = query.trim().toLocaleLowerCase("pt-BR");

    if (normalizedQuery.length === 0) {
      return props.items;
    }

    return props.items.filter((item: PlannedCalculatorNavItem) => {
      const searchableText: string = `${item.title} ${item.status}`
        .toLocaleLowerCase("pt-BR");
      return searchableText.includes(normalizedQuery);
    });
  }, [props.items, query]);

  return (
    <nav aria-label="Calculadoras planejadas">
      <label class="calculator-nav__search">
        <span class="calculator-nav__search-label">Filtrar calculadoras</span>
        <input
          class="calculator-nav__search-input"
          type="search"
          name="planned-calculators"
          placeholder="Ex.: juros"
          value={query}
          onInput={(event: Event) => {
            const target: HTMLInputElement = event.currentTarget as HTMLInputElement;
            setQuery(target.value);
          }}
        />
      </label>
      <ul class="calculator-nav">
        {filteredItems.map((item: PlannedCalculatorNavItem) => (
          <li key={item.href} class="calculator-nav__item">
            <a class="calculator-nav__link" href={item.href}>
              <span class="calculator-nav__title">{item.title}</span>
              <span class="calculator-nav__status">{item.status}</span>
            </a>
          </li>
        ))}
      </ul>
      {filteredItems.length === 0 && (
        <p class="calculator-nav__empty" role="status">
          Nenhuma calculadora planejada corresponde ao filtro informado.
        </p>
      )}
    </nav>
  );
}
