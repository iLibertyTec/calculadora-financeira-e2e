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

  if (input.monthlyRate === 0) {
    return {
      amortization: displayedAmortization,
      firstInstallment: displayedAmortization,
      lastInstallment: displayedAmortization,
      totalPaid: roundToCents(input.principal),
      totalInterest: 0,
    };
  }

  let remainingPrincipal: number = input.principal;
  let totalPaid: number = 0;
  let firstInstallment: number | undefined;
  let lastInstallment: number = 0;

  for (let month: number = 1; month <= input.termMonths; month += 1) {
    const interest: number = roundToCents(
      remainingPrincipal * input.monthlyRate,
    );
    const amortization: number = month === input.termMonths
      ? roundToCents(remainingPrincipal)
      : roundToCents(exactAmortization);
    const installment: number = roundToCents(amortization + interest);

    if (month === 1) {
      firstInstallment = installment;
    }

    lastInstallment = installment;
    totalPaid = roundToCents(totalPaid + installment);
    remainingPrincipal = roundToCents(remainingPrincipal - amortization);
  }

  return {
    amortization: displayedAmortization,
    firstInstallment: firstInstallment ?? 0,
    lastInstallment,
    totalPaid,
    totalInterest: roundToCents(totalPaid - input.principal),
  };
}
