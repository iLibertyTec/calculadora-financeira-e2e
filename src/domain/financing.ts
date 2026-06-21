export interface FinancingInput {
  principal: number;
  monthlyRate: number;
  termMonths: number;
}

export function roundToCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function assertValidFinancingInput(input: FinancingInput): void {
  if (!Number.isFinite(input.principal) || input.principal <= 0) {
    throw new RangeError("principal must be greater than zero");
  }

  if (!Number.isFinite(input.monthlyRate) || input.monthlyRate < 0) {
    throw new RangeError("monthlyRate must be greater than or equal to zero");
  }

  if (!Number.isInteger(input.termMonths) || input.termMonths <= 0) {
    throw new RangeError("termMonths must be a positive integer");
  }
}
