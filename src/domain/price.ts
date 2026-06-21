import {
  ensureValidFinancingInput,
  isEffectivelyZeroRate,
  roundCurrency,
} from "./financing.ts";

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
  const isZeroRate: boolean = isEffectivelyZeroRate(monthlyRate);

  const rawMonthlyPayment: number = isZeroRate
    ? principal / months
    : principal *
      (monthlyRate /
        (1 - Math.pow(1 + monthlyRate, -months)));

  const monthlyPayment: number = roundCurrency(rawMonthlyPayment);
  const totalPaid: number = roundCurrency(monthlyPayment * months);
  const totalInterest: number = roundCurrency(totalPaid - principal);

  return {
    monthlyPayment,
    totalPaid,
    totalInterest,
  };
}
