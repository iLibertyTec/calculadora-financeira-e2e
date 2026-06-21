export interface FinancingInput {
  principal: number;
  monthlyRate: number;
  months: number;
}

const ZERO_RATE_EPSILON: number = 1e-10;

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value);
}

export function ensureValidFinancingInput(input: FinancingInput): void {
  const { principal, monthlyRate, months } = input;

  if (!isFiniteNumber(principal) || principal <= 0) {
    throw new RangeError("Principal must be greater than zero");
  }

  if (!isFiniteNumber(monthlyRate)) {
    throw new RangeError("Monthly rate must be a finite number");
  }

  if (monthlyRate < 0) {
    throw new RangeError("Monthly rate cannot be negative");
  }

  if (!Number.isInteger(months) || months <= 0) {
    throw new RangeError("Months must be a positive integer");
  }
}

export function isEffectivelyZeroRate(monthlyRate: number): boolean {
  return Math.abs(monthlyRate) < ZERO_RATE_EPSILON;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
