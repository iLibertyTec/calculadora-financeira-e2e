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

  let totalPaid: number = 0;
  let firstInstallment: number | undefined;
  let lastInstallment: number = 0;

  for (let month: number = 1; month <= input.termMonths; month += 1) {
    const remainingPrincipal: number = input.principal -
      (exactAmortization * (month - 1));
    const interest: number = roundToCents(
      remainingPrincipal * input.monthlyRate,
    );
    const amortization: number = month === input.termMonths
      ? roundToCents(input.principal - (displayedAmortization * (month - 1)))
      : displayedAmortization;
    const installment: number = roundToCents(amortization + interest);

    if (month === 1) {
      firstInstallment = installment;
    }

    lastInstallment = installment;
    totalPaid = roundToCents(totalPaid + installment);
  }

  return {
    amortization: displayedAmortization,
    firstInstallment: firstInstallment ?? 0,
    lastInstallment,
    totalPaid,
    totalInterest: roundToCents(totalPaid - input.principal),
  };
}
