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

  const principalCents: number = toCents(principal);
  const baseAmortizationCents: number = Math.floor(principalCents / termMonths);
  const installments: SacInstallment[] = [];
  let remainingBalanceCents: number = principalCents;
  let totalPaidCents: number = 0;
  let totalInterestCents: number = 0;

  for (let index = 1; index <= termMonths; index += 1) {
    const interestCents: number = toCents(fromCents(remainingBalanceCents) * monthlyRate);
    const amortizationCents: number = index === termMonths
      ? remainingBalanceCents
      : baseAmortizationCents;
    const paymentCents: number = amortizationCents + interestCents;
    const nextBalanceCents: number = index === termMonths
      ? 0
      : remainingBalanceCents - amortizationCents;

    installments.push(Object.freeze({
      number: index,
      amortization: fromCents(amortizationCents),
      interest: fromCents(interestCents),
      payment: fromCents(paymentCents),
      remainingBalance: fromCents(nextBalanceCents),
    }));

    totalPaidCents += paymentCents;
    totalInterestCents += interestCents;
    remainingBalanceCents = nextBalanceCents;
  }

  const firstPayment: number = installments[0]?.payment ?? 0;
  const lastPayment: number = installments[installments.length - 1]?.payment ?? 0;

  return Object.freeze({
    principal: fromCents(principalCents),
    monthlyRate,
    termMonths,
    installments: Object.freeze([...installments]),
    summary: Object.freeze({
      firstPayment,
      lastPayment,
      totalPaid: fromCents(totalPaidCents),
      totalInterest: fromCents(totalInterestCents),
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
  if (!Number.isFinite(termMonths) || !Number.isInteger(termMonths) || termMonths <= 0) {
    throw new Error("termMonths must be a positive integer");
  }
}

function toCents(value: number): number {
  return Math.round(value * 100);
}

function fromCents(value: number): number {
  return value / 100;
}
