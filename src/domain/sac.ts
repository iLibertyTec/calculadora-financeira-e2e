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
  let totalInterest: number = 0;
  let firstInstallment: number | undefined;
  let lastInstallment: number = 0;

  for (let month: number = 1; month <= input.termMonths; month += 1) {
    const remainingPrincipal: number = input.principal -
      (exactAmortization * (month - 1));
    const interest: number = roundToCents(
      remainingPrincipal * input.monthlyRate,
    );
    const amortization: number = month === input.termMonths
      ? roundToCents(input.principal - (exactAmortization * (month - 1)))
      : displayedAmortization;
    const installment: number = roundToCents(amortization + interest);

    if (month === 1) {
      firstInstallment = installment;
    }

    if (month > 1 && installment > lastInstallment && input.monthlyRate > 0) {
      throw new RangeError("SAC installments must not increase for positive rate");
    }

    lastInstallment = installment;
    totalPaid = roundToCents(totalPaid + installment);
    totalInterest = roundToCents(totalInterest + interest);
  }

  return {
    amortization: displayedAmortization,
    firstInstallment: firstInstallment ?? 0,
    lastInstallment,
    totalPaid,
    totalInterest,
  };
}
