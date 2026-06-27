import {
  assertValidFinancingInput,
  roundToCents,
  type FinancingInput,
} from "./financing.ts";

export interface SacResult {
  amortization: number;
  firstInstallment: number;
  lastInstallment: number;
  totalPaid: number;
  totalInterest: number;
}

export function calculateSac(input: FinancingInput): SacResult {
  assertValidFinancingInput(input);

  const exactAmortization: number = input.principal / input.termMonths;
  const displayedAmortization: number = roundToCents(exactAmortization);

  let totalInterest: number = 0;
  let firstInstallment: number | undefined;
  let lastInstallment: number = 0;
  let previousDisplayedInstallment: number | undefined;

  for (let month: number = 1; month <= input.termMonths; month += 1) {
    const remainingPrincipal: number = input.principal -
      (exactAmortization * (month - 1));
    const interest: number = roundToCents(
      remainingPrincipal * input.monthlyRate,
    );
    const amortization: number = month === input.termMonths
      ? roundToCents(input.principal - (displayedAmortization * (month - 1)))
      : displayedAmortization;
    let installment: number = roundToCents(amortization + interest);

    if (
      input.monthlyRate > 0 &&
      previousDisplayedInstallment !== undefined &&
      installment > previousDisplayedInstallment &&
      month === input.termMonths &&
      installment - previousDisplayedInstallment <= 0.01
    ) {
      installment = previousDisplayedInstallment;
    }

    if (month === 1) {
      firstInstallment = installment;
    }

    previousDisplayedInstallment = installment;
    lastInstallment = installment;
    totalInterest = roundToCents(totalInterest + interest);
  }

  const totalPaid: number = roundToCents(input.principal + totalInterest);

  return {
    amortization: displayedAmortization,
    firstInstallment: firstInstallment ?? 0,
    lastInstallment,
    totalPaid,
    totalInterest,
  };
}
