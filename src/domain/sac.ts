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

  const amortization: number = roundToCents(input.principal / input.termMonths);

  if (input.monthlyRate === 0) {
    const installment: number = amortization;
    const totalPaid: number = roundToCents(installment * input.termMonths);

    return {
      amortization,
      firstInstallment: installment,
      lastInstallment: installment,
      totalPaid,
      totalInterest: roundToCents(totalPaid - input.principal),
    };
  }

  const firstOutstandingPrincipal: number = input.principal;
  const lastOutstandingPrincipal: number = input.principal -
    amortization * (input.termMonths - 1);

  const firstInstallment: number = roundToCents(
    amortization + firstOutstandingPrincipal * input.monthlyRate,
  );
  const lastInstallment: number = roundToCents(
    amortization + lastOutstandingPrincipal * input.monthlyRate,
  );

  let totalPaid: number = 0;

  for (let month: number = 0; month < input.termMonths; month += 1) {
    const outstandingPrincipal: number = input.principal - amortization * month;
    const installment: number = roundToCents(
      amortization + outstandingPrincipal * input.monthlyRate,
    );
    totalPaid += installment;
  }

  totalPaid = roundToCents(totalPaid);

  return {
    amortization,
    firstInstallment,
    lastInstallment,
    totalPaid,
    totalInterest: roundToCents(totalPaid - input.principal),
  };
}
