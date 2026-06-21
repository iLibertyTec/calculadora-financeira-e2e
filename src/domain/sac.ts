import { roundToCents } from "./money.ts";

export interface SacInstallment {
  readonly number: number;
  readonly amortization: number;
  readonly interest: number;
  readonly payment: number;
  readonly remainingBalance: number;
}

export interface SacSummary {
  readonly firstPayment: number;
  readonly lastPayment: number;
  readonly totalPaid: number;
  readonly totalInterest: number;
}

export interface SacSchedule {
  readonly principal: number;
  readonly monthlyRate: number;
  readonly termMonths: number;
  readonly installments: readonly SacInstallment[];
  readonly summary: SacSummary;
}

export function generateSacSchedule(
  principal: number,
  monthlyRate: number,
  termMonths: number,
): SacSchedule {
  validatePrincipal(principal);
  validateMonthlyRate(monthlyRate);
  validateTermMonths(termMonths);

  const amortization: number = roundToCents(principal / termMonths);
  const installments: SacInstallment[] = [];
  let balance: number = principal;
  let totalPaid: number = 0;
  let totalInterest: number = 0;

  for (let index = 1; index <= termMonths; index += 1) {
    const interest: number = roundToCents(balance * monthlyRate);
    const rawAmortization: number = index === termMonths
      ? balance
      : amortization;
    const amortizationValue: number = roundToCents(rawAmortization);
    const payment: number = roundToCents(amortizationValue + interest);
    const nextBalance: number = roundToCents(balance - amortizationValue);

    installments.push(Object.freeze({
      number: index,
      amortization: amortizationValue,
      interest,
      payment,
      remainingBalance: nextBalance,
    }));

    totalPaid = roundToCents(totalPaid + payment);
    totalInterest = roundToCents(totalInterest + interest);
    balance = nextBalance;
  }

  const firstPayment: number = installments[0]?.payment ?? 0;
  const lastPayment: number = installments[installments.length - 1]?.payment ?? 0;

  return Object.freeze({
    principal,
    monthlyRate,
    termMonths,
    installments: Object.freeze([...installments]),
    summary: Object.freeze({
      firstPayment,
      lastPayment,
      totalPaid,
      totalInterest,
    }),
  });
}

function validatePrincipal(principal: number): void {
  if (!Number.isFinite(principal) || principal <= 0) {
    throw new Error("principal must be greater than zero");
  }
}

function validateMonthlyRate(monthlyRate: number): void {
  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) {
    throw new Error("monthlyRate must be zero or greater");
  }
}

function validateTermMonths(termMonths: number): void {
  if (!Number.isInteger(termMonths) || termMonths <= 0) {
    throw new Error("termMonths must be a positive integer");
  }
}
