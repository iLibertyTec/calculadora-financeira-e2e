import { ensureValidFinancingInput, roundCurrency } from "./financing.ts";

export interface PriceCalculationInput {
  principal: number;
  monthlyRate: number;
  months: number;
}

export interface PriceCalculationResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

export function calculatePriceAmortization(
  input: PriceCalculationInput,
): PriceCalculationResult {
  ensureValidFinancingInput(input);

  const { principal, monthlyRate, months } = input;
  const isZeroRate: boolean = monthlyRate === 0;

  const growthFactor: number = isZeroRate ? 1 : (1 + monthlyRate) ** months;
  const rawMonthlyPayment: number = isZeroRate
    ? principal / months
    : principal * ((monthlyRate * growthFactor) / (growthFactor - 1));

  const monthlyPayment: number = roundCurrency(rawMonthlyPayment);
  const totalPaid: number = roundCurrency(monthlyPayment * months);
  const totalInterest: number = roundCurrency(totalPaid - principal);

  return {
    monthlyPayment,
    totalPaid,
    totalInterest,
  };
}
