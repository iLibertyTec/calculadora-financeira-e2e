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

function calculateRawMonthlyPayment(
  principal: number,
  monthlyRate: number,
  months: number,
): number {
  if (isEffectivelyZeroRate(monthlyRate)) {
    return principal / months;
  }

  const logFactor: number = -months * Math.log1p(monthlyRate);
  const denominator: number = -Math.expm1(logFactor);

  return principal * (monthlyRate / denominator);
}

export function calculatePriceAmortization(
  input: PriceCalculationInput,
): PriceCalculationResult {
  ensureValidFinancingInput(input);

  const { principal, monthlyRate, months } = input;
  const rawMonthlyPayment: number = calculateRawMonthlyPayment(
    principal,
    monthlyRate,
    months,
  );

  const monthlyPayment: number = roundCurrency(rawMonthlyPayment);
  const totalPaid: number = roundCurrency(rawMonthlyPayment * months);
  const totalInterest: number = roundCurrency(totalPaid - principal);

  return {
    monthlyPayment,
    totalPaid,
    totalInterest,
  };
}
