export type LegacyVisitState = {
  visits: number;
  lastVisitor?: string;
  updatedAt: string;
};

/**
 * @deprecated Seed legado isolado do template original.
 * Não faz parte do fluxo público da calculadora financeira.
 */
export class LegacyVisitCounter {
  #visits = 0;
  #lastVisitor?: string;

  get state(): LegacyVisitState {
    return {
      visits: this.#visits,
      lastVisitor: this.#lastVisitor,
      updatedAt: new Date().toISOString(),
    };
  }

  recordVisit(visitorId?: string): LegacyVisitState {
    this.#visits += 1;
    if (visitorId) this.#lastVisitor = visitorId;
    return this.state;
  }

  reset(): void {
    this.#visits = 0;
    this.#lastVisitor = undefined;
  }
}

/**
 * @deprecated Seed legado isolado do template original.
 */
export function formatLegacyCounterMessage(state: LegacyVisitState): string {
  const n: number = state.visits;
  if (n === 0) return "Nenhuma visita registrada.";
  if (n === 1) return "Uma visita registrada.";
  return `${n} visitas registradas.`;
}
