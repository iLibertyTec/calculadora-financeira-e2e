export interface FinancingInput {
  principal: number;
  monthlyRate: number;
  months: number;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function isEffectivelyZeroRate(monthlyRate: number): boolean {
  return Math.abs(monthlyRate) <= 1e-10;
}

export function ensureValidFinancingInput(input: FinancingInput): void {
  const { principal, monthlyRate, months } = input;

  if (!Number.isFinite(principal) || principal <= 0) {
    throw new RangeError("Principal must be greater than zero");
  }

  if (!Number.isFinite(monthlyRate)) {
    throw new RangeError("Monthly rate must be a finite number");
  }

  if (monthlyRate < 0) {
    throw new RangeError("Monthly rate cannot be negative");
  }

  if (!Number.isFinite(months) || !Number.isInteger(months) || months <= 0) {
    throw new RangeError("Months must be a positive integer");
  }
}
