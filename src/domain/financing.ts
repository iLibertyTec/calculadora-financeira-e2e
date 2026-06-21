export interface FinancingInput {
  principal: number;
  monthlyRate: number;
  months: number;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function ensureValidFinancingInput(input: FinancingInput): void {
  const { principal, monthlyRate, months } = input;

  if (!Number.isFinite(principal) || principal <= 0) {
    throw new Error("Principal must be greater than zero");
  }

  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) {
    throw new Error("Monthly rate cannot be negative");
  }

  if (!Number.isFinite(months) || !Number.isInteger(months) || months <= 0) {
    throw new Error("Months must be a positive integer");
  }
}
