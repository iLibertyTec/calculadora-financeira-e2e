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

  const monthlyPayment: number = monthlyRate === 0
    ? roundCurrency(principal / months)
    : roundCurrency(
      principal *
        ((monthlyRate * (1 + monthlyRate) ** months) /
          ((1 + monthlyRate) ** months - 1)),
    );

  const totalPaid: number = roundCurrency(monthlyPayment * months);
  const totalInterest: number = roundCurrency(totalPaid - principal);

  return {
    monthlyPayment,
    totalPaid,
    totalInterest,
  };
}
